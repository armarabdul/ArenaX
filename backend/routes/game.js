const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const Player = require('../models/Player');
const auth = require('../middleware/auth');

// Get all games (templates and instances)
router.get('/', async (req, res) => {
  try {
    const games = await Game.find().sort({ gameId: 1, timestamp: -1 });
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get unique game templates
// Templates are games that can be started - we get the original template (empty players or oldest)
router.get('/templates', async (req, res) => {
  try {
    const games = await Game.aggregate([
      { $sort: { gameId: 1, timestamp: 1 } }, // Sort by timestamp ascending to get oldest first
      { 
        $group: { 
          _id: '$gameId', 
          // Prefer template with empty players, otherwise get the oldest one
          template: {
            $first: {
              $cond: [
                { $eq: [{ $size: '$playersInvolved' }, 0] },
                '$$ROOT',
                null
              ]
            }
          },
          oldest: { $first: '$$ROOT' }
        } 
      },
      {
        $project: {
          _id: { $ifNull: ['$template._id', '$oldest._id'] },
          gameId: { $ifNull: ['$template.gameId', '$oldest.gameId'] },
          gameName: { $ifNull: ['$template.gameName', '$oldest.gameName'] },
          description: { $ifNull: ['$template.description', '$oldest.description'] },
          entryCost: { $ifNull: ['$template.entryCost', '$oldest.entryCost'] },
          maxPoints: { $ifNull: ['$template.maxPoints', '$oldest.maxPoints'] },
          type: { $ifNull: ['$template.type', '$oldest.type'] },
          status: 'pending', // Always show as pending for templates
          playersInvolved: [],
          results: [],
          timestamp: { $ifNull: ['$template.timestamp', '$oldest.timestamp'] }
        }
      },
      { $sort: { gameId: 1 } }
    ]);
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get game by ID
router.get('/:id', async (req, res) => {
  try {
    const game = await Game.findOne({ gameId: req.params.id });
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start game (assign players)
router.post('/start', auth, async (req, res) => {
  try {
    const { gameId, playerIds } = req.body;

    // Find a template game - get the most recent game with this gameId to use as template
    // This allows starting the same game multiple times
    const templateGame = await Game.findOne({ gameId: gameId.toUpperCase() })
      .sort({ timestamp: -1 });
    
    if (!templateGame) {
      return res.status(404).json({ message: 'Game template not found' });
    }

    // Validate player count
    if (templateGame.type === 'single' && playerIds.length !== 1) {
      return res.status(400).json({ message: 'Single player game requires exactly 1 player' });
    }
    if (templateGame.type === 'faceoff' && playerIds.length !== 2) {
      return res.status(400).json({ message: 'Faceoff game requires exactly 2 players' });
    }

    // Check if players exist and have enough tokens
    const players = await Player.find({ playerId: { $in: playerIds } });
    if (players.length !== playerIds.length) {
      return res.status(400).json({ message: 'One or more players not found' });
    }

    // Check game attempts for each player
    for (const player of players) {
      if (player.tokens < templateGame.entryCost) {
        return res.status(400).json({ message: `${player.name} doesn't have enough tokens` });
      }

      // Count how many times player has played this game
      const gameAttempts = player.gameHistory.filter(h => h.gameId === gameId);
      const winCount = gameAttempts.filter(h => h.result === 'Win').length;
      const loseCount = gameAttempts.filter(h => h.result === 'Lose').length;
      const totalAttempts = gameAttempts.length;

      // Player can only play once, or twice if they lost the first time
      if (totalAttempts >= 2) {
        return res.status(400).json({ 
          message: `${player.name} has already played ${templateGame.gameName} the maximum number of times (2)` 
        });
      }

      if (totalAttempts === 1 && winCount === 1) {
        return res.status(400).json({ 
          message: `${player.name} has already won ${templateGame.gameName} and cannot play again` 
        });
      }
    }

    // Deduct entry cost
    for (const player of players) {
      player.tokens -= templateGame.entryCost;
      await player.save();
    }

    // Create new game instance
    const newGame = new Game({
      gameId: templateGame.gameId,
      gameName: templateGame.gameName,
      description: templateGame.description || '',
      entryCost: templateGame.entryCost,
      maxPoints: templateGame.maxPoints,
      type: templateGame.type,
      playersInvolved: playerIds,
      status: 'active',
      results: [],
      timestamp: new Date()
    });

    await newGame.save();

    const io = req.app.get('io');
    if (io) {
      io.emit('gameUpdated');
      io.emit('playerUpdated');
    }

    res.json(newGame);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark game results
router.put('/result', auth, async (req, res) => {
  try {
    const { gameInstanceId, results } = req.body; // results: [{ playerId, result: 'Win'/'Lose' }]

    const game = await Game.findById(gameInstanceId);
    if (!game) {
      return res.status(404).json({ message: 'Game instance not found' });
    }

    if (game.status !== 'active') {
      return res.status(400).json({ message: 'Game is not active' });
    }

    // Validate results
    if (results.length !== game.playersInvolved.length) {
      return res.status(400).json({ message: 'Results count does not match players involved' });
    }

    game.results = results;
    game.status = 'completed';

    // Update player stats
    const players = await Player.find({ playerId: { $in: game.playersInvolved } });
    
    for (const result of results) {
      const player = players.find(p => p.playerId === result.playerId);
      if (!player) continue;

      if (result.result === 'Win') {
        // Winner gets points and token refund
        player.points += game.maxPoints;
        player.tokens += game.entryCost; // Refund entry cost
      }
      // Loser: tokens already deducted when game started, no refund

      // Update game history
      player.gameHistory.push({
        gameId: game.gameId,
        gameName: game.gameName,
        result: result.result,
        points: result.result === 'Win' ? game.maxPoints : 0,
        timestamp: new Date()
      });

      // Update games played
      player.gamesPlayed += 1;

      // Update opponents faced
      const opponents = game.playersInvolved.filter(id => id !== player.playerId);
      for (const opponentId of opponents) {
        if (!player.opponentsFaced.includes(opponentId)) {
          player.opponentsFaced.push(opponentId);
        }
      }

      await player.save();
    }

    await game.save();

    const io = req.app.get('io');
    if (io) {
      io.emit('gameUpdated');
      io.emit('playerUpdated');
    }

    res.json({ game, players });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new game
router.post('/create', auth, async (req, res) => {
  try {
    const { gameId, gameName, description, entryCost, maxPoints, type } = req.body;

    // Validate required fields
    if (!gameId || !gameName || entryCost === undefined || maxPoints === undefined || !type) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate type
    if (!['single', 'faceoff'].includes(type)) {
      return res.status(400).json({ message: 'Type must be either "single" or "faceoff"' });
    }

    // Check if game template already exists (for templates, we check if there's a pending/completed one)
    const existingGame = await Game.findOne({ 
      gameId: gameId.toUpperCase(), 
      status: { $in: ['pending', 'completed'] } 
    }).sort({ timestamp: -1 });
    
    if (existingGame) {
      return res.status(400).json({ message: 'Game template with this ID already exists' });
    }

    const game = new Game({
      gameId: gameId.toUpperCase(),
      gameName,
      description: description || '',
      entryCost: parseInt(entryCost),
      maxPoints: parseInt(maxPoints),
      type,
      status: 'pending',
      playersInvolved: [],
      results: []
    });

    await game.save();

    const io = req.app.get('io');
    if (io) {
      io.emit('gameUpdated');
    }

    res.status(201).json(game);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update game
router.put('/update/:id', auth, async (req, res) => {
  try {
    const game = await Game.findOne({ gameId: req.params.id });
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    const { gameName, description, entryCost, maxPoints, type } = req.body;

    // Don't allow editing if game is active or completed (unless resetting)
    if (game.status === 'active' && !req.body.force) {
      return res.status(400).json({ message: 'Cannot edit active game. Complete it first or use force flag.' });
    }

    if (gameName) game.gameName = gameName;
    if (description !== undefined) game.description = description;
    if (entryCost !== undefined) game.entryCost = parseInt(entryCost);
    if (maxPoints !== undefined) game.maxPoints = parseInt(maxPoints);
    if (type) {
      if (!['single', 'faceoff'].includes(type)) {
        return res.status(400).json({ message: 'Type must be either "single" or "faceoff"' });
      }
      game.type = type;
    }

    await game.save();

    const io = req.app.get('io');
    if (io) {
      io.emit('gameUpdated');
    }

    res.json(game);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete game
router.delete('/:id', auth, async (req, res) => {
  try {
    const game = await Game.findOne({ gameId: req.params.id });
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    // Don't allow deleting active games
    if (game.status === 'active') {
      return res.status(400).json({ message: 'Cannot delete active game. Complete it first.' });
    }

    await Game.findOneAndDelete({ gameId: req.params.id });

    const io = req.app.get('io');
    if (io) {
      io.emit('gameUpdated');
    }

    res.json({ message: 'Game deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Initialize games (one-time setup)
router.post('/initialize', auth, async (req, res) => {
  try {
    const games = [
      { gameId: 'G1', gameName: 'Match the Soda', description: 'Match the soda cans in the correct order. Test your memory and pattern recognition skills!', entryCost: 1, maxPoints: 3, type: 'single' },
      { gameId: 'G2', gameName: 'Guess the Meme', description: 'Guess the meme! Identify popular memes from images or descriptions. How well do you know internet culture?', entryCost: 1, maxPoints: 3, type: 'single' },
      { gameId: 'G3', gameName: 'Flag Race', description: 'Flag Race - Identify country flags as fast as you can. Speed and knowledge are key!', entryCost: 1, maxPoints: 3, type: 'single' },
      { gameId: 'G4', gameName: 'Speed Typing', description: 'Speed Typing - Type the given text as quickly and accurately as possible. Every second counts!', entryCost: 1, maxPoints: 3, type: 'single' },
      { gameId: 'G5', gameName: 'Memory Match', description: 'Memory Match - Find matching pairs of cards. Challenge your short-term memory!', entryCost: 1, maxPoints: 3, type: 'single' },
      { gameId: 'G6', gameName: 'Math Challenge', description: 'Math Challenge - Solve mathematical problems under time pressure. Quick thinking required!', entryCost: 1, maxPoints: 3, type: 'single' },
      { gameId: 'G7', gameName: 'Word Puzzle', description: 'Word Puzzle - Unscramble words or solve word-based puzzles. Vocabulary and logic combined!', entryCost: 1, maxPoints: 3, type: 'single' },
      { gameId: 'G8', gameName: 'Reaction Test', description: 'Reaction Test - Test your reflexes! Click when you see the signal. Fastest reaction wins!', entryCost: 1, maxPoints: 3, type: 'single' },
      { gameId: 'G9', gameName: 'Tic Tac Toe', description: 'Tic Tac Toe - Classic faceoff game! Challenge another player in this strategic battle.', entryCost: 2, maxPoints: 5, type: 'faceoff' },
      { gameId: 'G10', gameName: 'Rock Paper Scissors', description: 'Rock Paper Scissors - The ultimate game of chance and strategy. Best of luck!', entryCost: 2, maxPoints: 5, type: 'faceoff' }
    ];

    for (const gameData of games) {
      const existingGame = await Game.findOne({ gameId: gameData.gameId });
      if (!existingGame) {
        const game = new Game({
          ...gameData,
          description: gameData.description || '',
          status: 'pending',
          playersInvolved: [],
          results: []
        });
        await game.save();
      } else {
        // Update description if it doesn't exist
        if (!existingGame.description && gameData.description) {
          await Game.updateMany(
            { gameId: gameData.gameId },
            { $set: { description: gameData.description } }
          );
        }
      }
    }

    const io = req.app.get('io');
    if (io) {
      io.emit('gameUpdated');
    }

    res.json({ message: 'Games initialized successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

