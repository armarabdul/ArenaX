const express = require('express');
const router = express.Router();
const Player = require('../models/Player');
const auth = require('../middleware/auth');

// Get all players
router.get('/', async (req, res) => {
  try {
    const players = await Player.find().sort({ points: -1, createdAt: -1 });
    res.json(players);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get player by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const player = await Player.findOne({ playerId: req.params.id });
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }
    res.json(player);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new player
router.post('/add', auth, async (req, res) => {
  try {
    const { name, department, contact } = req.body;

    // Generate player ID
    const lastPlayer = await Player.findOne().sort({ playerId: -1 });
    let nextNumber = 1;
    if (lastPlayer && lastPlayer.playerId) {
      const lastNumber = parseInt(lastPlayer.playerId.replace('ARX', ''));
      nextNumber = lastNumber + 1;
    }
    const playerId = `ARX${String(nextNumber).padStart(3, '0')}`;

    const player = new Player({
      playerId,
      name,
      department,
      contact,
      tokens: 10,
      points: 0,
      gamesPlayed: 0,
      opponentsFaced: [],
      gameHistory: []
    });

    await player.save();
    
    // Emit update to connected clients
    const io = req.app.get('io');
    if (io) {
      io.emit('playerUpdated');
    }

    res.status(201).json(player);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update player
router.put('/update/:id', auth, async (req, res) => {
  try {
    const player = await Player.findOne({ playerId: req.params.id });
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    const { name, department, contact, tokens, points, gamesPlayed, opponentsFaced } = req.body;
    
    if (name) player.name = name;
    if (department) player.department = department;
    if (contact) player.contact = contact;
    if (tokens !== undefined) player.tokens = tokens;
    if (points !== undefined) player.points = points;
    if (gamesPlayed !== undefined) player.gamesPlayed = gamesPlayed;
    if (opponentsFaced) player.opponentsFaced = opponentsFaced;

    await player.save();
    
    // Emit update
    const io = req.app.get('io');
    if (io) {
      io.emit('playerUpdated');
    }

    res.json(player);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete player
router.delete('/:id', auth, async (req, res) => {
  try {
    const player = await Player.findOneAndDelete({ playerId: req.params.id });
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    // Emit update
    const io = req.app.get('io');
    if (io) {
      io.emit('playerUpdated');
    }

    res.json({ message: 'Player deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

