const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/arenax', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('MongoDB connected');
  
  try {
    // Drop the unique index on gameId
    const db = mongoose.connection.db;
    const gamesCollection = db.collection('games');
    
    // Get all indexes
    const indexes = await gamesCollection.indexes();
    console.log('Current indexes:', indexes);
    
    // Drop the unique index on gameId if it exists
    try {
      await gamesCollection.dropIndex('gameId_1');
      console.log('✅ Successfully dropped unique index on gameId');
    } catch (error) {
      if (error.code === 27 || error.message.includes('index not found')) {
        console.log('ℹ️  Unique index on gameId does not exist (this is fine)');
      } else {
        throw error;
      }
    }
    
    // Verify the index is gone
    const updatedIndexes = await gamesCollection.indexes();
    console.log('Updated indexes:', updatedIndexes);
    
    console.log('✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during migration:', error);
    process.exit(1);
  }
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

