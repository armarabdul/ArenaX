const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  playerId: { type: String, required: true },
  result: { type: String, enum: ['Win', 'Lose'], required: true }
});

const gameSchema = new mongoose.Schema({
  gameId: { 
    type: String, 
    required: true, 
    uppercase: true
    // Removed unique constraint to allow multiple instances
  },
  gameName: { 
    type: String, 
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  entryCost: { 
    type: Number, 
    required: true,
    min: 0
  },
  maxPoints: { 
    type: Number, 
    required: true,
    min: 0
  },
  type: { 
    type: String, 
    enum: ['single', 'faceoff'], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['active', 'completed', 'pending'], 
    default: 'pending'
  },
  playersInvolved: [{ 
    type: String 
  }],
  results: [resultSchema],
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
}, {
  // Explicitly disable unique index on gameId
  // This allows multiple game instances with the same gameId
});

// Create non-unique index on gameId (allows multiple instances)
gameSchema.index({ gameId: 1 }, { unique: false });

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;

