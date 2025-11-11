const express = require('express');
const router = express.Router();
const Player = require('../models/Player');

// Get leaderboard
router.get('/', async (req, res) => {
  try {
    const players = await Player.find()
      .select('playerId name department points tokens gamesPlayed')
      .sort({ points: -1, gamesPlayed: 1, createdAt: 1 });
    
    const leaderboard = players.map((player, index) => ({
      rank: index + 1,
      playerId: player.playerId,
      name: player.name,
      department: player.department,
      points: player.points,
      tokens: player.tokens,
      gamesPlayed: player.gamesPlayed
    }));

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

