# Fix for E11000 Duplicate Key Error

## Problem
MongoDB was throwing `E11000 duplicate key error collection: arenax.games index: gameId_1` because there was a unique index on the `gameId` field, preventing multiple game instances with the same gameId.

## Solution

### ✅ Step 1: Drop the Unique Index (COMPLETED)
The unique index has been successfully dropped from your database. You can verify this by running:

```bash
npm run fix-game-index
```

Or manually:
```bash
node backend/scripts/drop-gameid-index.js
```

### ✅ Step 2: Updated Game Model
The Game model now explicitly allows multiple instances:
- Removed `unique: true` constraint
- Added non-unique index: `gameSchema.index({ gameId: 1 }, { unique: false })`

### ✅ Step 3: Server Auto-Fix
The server now automatically drops the unique index on startup if it exists.

### ✅ Step 4: Game Start Logic
Updated to allow starting the same game multiple times:
- Finds any game with the gameId as a template
- Creates a new instance each time
- No longer checks for unique gameId

## How to Use

1. **Restart your backend server** - The index will be automatically dropped on startup
2. **Start multiple game instances**:
   - Go to Game Control tab
   - Select a game template
   - Choose players
   - Click "Start Game"
   - You can immediately start another instance of the same game!

## Verification

After restarting the server, you should see:
```
✅ Dropped unique index on gameId (allows multiple instances)
```

Or if the index was already dropped:
```
ℹ️  No unique index on gameId (already allows multiple instances)
```

## Troubleshooting

If you still get the error:
1. Make sure the backend server has been restarted
2. Run the migration script manually: `npm run fix-game-index`
3. Check MongoDB directly:
   ```javascript
   db.games.getIndexes()
   // Should NOT show gameId_1 as unique
   ```

---

**Status: ✅ FIXED** - You can now start multiple instances of the same game!

