// server.js

const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// --- SOCKET.IO SETUP ---
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// --- CORS MIDDLEWARE (fix for Vercel/Render) ---
const normalizeOrigin = (o) => (o || '').replace(/\/+$/, ''); // remove trailing slash

const allowedOrigins = [
  normalizeOrigin(process.env.CLIENT_URL) || 'http://localhost:3000',
];

app.use((req, res, next) => {
  const origin = normalizeOrigin(req.headers.origin);
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json());

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/arenax', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('MongoDB connected');

  // Drop unique index on gameId if it exists (allows multiple game instances)
  try {
    const Game = require('./models/Game');
    const db = mongoose.connection.db;
    const gamesCollection = db.collection('games');

    try {
      await gamesCollection.dropIndex('gameId_1');
      console.log('✅ Dropped unique index on gameId (allows multiple instances)');
    } catch (error) {
      if (error.code === 27 || (error.message && error.message.includes('index not found'))) {
        console.log('ℹ️  No unique index on gameId (already allows multiple instances)');
      } else {
        console.warn('⚠️  Could not drop index:', error.message);
      }
    }
  } catch (error) {
    console.warn('⚠️  Could not check/drop gameId index:', error.message);
  }
})
.catch(err => console.error('MongoDB connection error:', err));

// --- ROUTES ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/player', require('./routes/player'));
app.use('/api/game', require('./routes/game'));
app.use('/api/leaderboard', require('./routes/leaderboard'));
app.use('/api/admin', require('./routes/admin'));

// --- SOCKET.IO HANDLING ---
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Make io available to routes
app.set('io', io);

// --- START SERVER ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
