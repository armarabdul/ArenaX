const express = require('express');
const router = express.Router();
const Player = require('../models/Player');
const Game = require('../models/Game');
const auth = require('../middleware/auth');

// Reset leaderboard (reset all players to initial state)
router.put('/reset', auth, async (req, res) => {
  try {
    await Player.updateMany({}, {
      tokens: 10,
      points: 0,
      gamesPlayed: 0,
      opponentsFaced: [],
      gameHistory: []
    });

    await Game.updateMany({}, {
      status: 'pending',
      playersInvolved: [],
      results: []
    });

    const io = req.app.get('io');
    if (io) {
      io.emit('playerUpdated');
      io.emit('gameUpdated');
    }

    res.json({ message: 'Leaderboard reset successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get dashboard stats
router.get('/stats', auth, async (req, res) => {
  try {
    const totalPlayers = await Player.countDocuments();
    const totalGames = await Game.countDocuments();
    const activeGames = await Game.countDocuments({ status: 'active' });
    const completedGames = await Game.countDocuments({ status: 'completed' });
    const totalPoints = await Player.aggregate([
      { $group: { _id: null, total: { $sum: '$points' } } }
    ]);

    res.json({
      totalPlayers,
      totalGames,
      activeGames,
      completedGames,
      totalPoints: totalPoints[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

