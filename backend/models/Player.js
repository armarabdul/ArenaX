const mongoose = require('mongoose');

const gameHistorySchema = new mongoose.Schema({
  gameId: { type: String, required: true },
  gameName: { type: String, required: true },
  result: { type: String, enum: ['Win', 'Lose'], required: true },
  points: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now }
});

const playerSchema = new mongoose.Schema({
  playerId: { 
    type: String, 
    required: true, 
    unique: true,
    uppercase: true
  },
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  department: { 
    type: String, 
    required: true,
    trim: true
  },
  contact: { 
    type: String, 
    required: true,
    trim: true
  },
  tokens: { 
    type: Number, 
    default: 10,
    min: 0
  },
  points: { 
    type: Number, 
    default: 0,
    min: 0
  },
  gamesPlayed: { 
    type: Number, 
    default: 0,
    min: 0
  },
  opponentsFaced: [{ 
    type: String 
  }],
  gameHistory: [gameHistorySchema],
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Player', playerSchema);

