import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import io from 'socket.io-client';

const GameControl = () => {
  const [gameTemplates, setGameTemplates] = useState([]);
  const [activeGames, setActiveGames] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showAddGameModal, setShowAddGameModal] = useState(false);
  const [showEditGameModal, setShowEditGameModal] = useState(false);
  const [activeTab, setActiveTab] = useState('templates'); // 'templates' or 'active'
  const [gameFormData, setGameFormData] = useState({
    gameId: '',
    gameName: '',
    description: '',
    entryCost: 1,
    maxPoints: 3,
    type: 'single'
  });
  const [playerSearch, setPlayerSearch] = useState('');

  useEffect(() => {
    fetchGames();
    fetchPlayers();

    const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');
    socket.on('gameUpdated', () => {
      fetchGames();
    });
    socket.on('playerUpdated', () => {
      fetchPlayers();
    });

    return () => socket.disconnect();
  }, []);

  const filteredPlayers = players.filter((p) => {
    if (!playerSearch) return true;
    const q = playerSearch.toLowerCase();
    return (
      p.playerId.toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q)
    );
  });

  const fetchGames = async () => {
    try {
      const [templatesResponse, allGamesResponse] = await Promise.all([
        api.get('/api/game/templates'),
        api.get('/api/game')
      ]);
      setGameTemplates(templatesResponse.data);
      // Filter active games
      const active = allGamesResponse.data.filter(g => g.status === 'active');
      setActiveGames(active);
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlayers = async () => {
    try {
      const response = await api.get('/api/player');
      setPlayers(response.data);
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  const handleGameSelect = (game) => {
    // If selecting from templates, prepare to start a new instance
    // If selecting from active games, use the existing instance
    setSelectedGame(game);
    setSelectedPlayers([]);
    setResults([]);
    
    // If it's an active game from the active tab, pre-populate players
    if (activeTab === 'active' && game.status === 'active') {
      setSelectedPlayers(game.playersInvolved);
    }
  };

  const handlePlayerSelect = (playerId) => {
    if (selectedPlayers.includes(playerId)) {
      setSelectedPlayers(selectedPlayers.filter(id => id !== playerId));
    } else {
      if (selectedGame?.type === 'single' && selectedPlayers.length >= 1) {
        alert('Single player game can only have 1 player');
        return;
      }
      if (selectedGame?.type === 'faceoff' && selectedPlayers.length >= 2) {
        alert('Faceoff game can only have 2 players');
        return;
      }
      setSelectedPlayers([...selectedPlayers, playerId]);
    }
  };

  const handleStartGame = async () => {
    if (!selectedGame) {
      alert('Please select a game');
      return;
    }

    if (selectedGame.type === 'single' && selectedPlayers.length !== 1) {
      alert('Single player game requires exactly 1 player');
      return;
    }

    if (selectedGame.type === 'faceoff' && selectedPlayers.length !== 2) {
      alert('Faceoff game requires exactly 2 players');
      return;
    }

    try {
      const response = await api.post('/api/game/start', {
        gameId: selectedGame.gameId,
        playerIds: selectedPlayers,
      });
      alert('Game started! Players can now play.');
      // Clear selection to allow starting another instance
      setSelectedGame(null);
      setSelectedPlayers([]);
      fetchGames();
    } catch (error) {
      alert(error.response?.data?.message || 'Error starting game');
    }
  };

  const handleMarkResults = async () => {
    if (results.length !== selectedGame.playersInvolved.length) {
      alert('Please mark results for all players');
      return;
    }

    try {
      await api.put('/api/game/result', {
        gameInstanceId: selectedGame._id, // Use _id for the specific game instance
        results: results,
      });
      setShowResultModal(false);
      setResults([]);
      setSelectedGame(null);
      setSelectedPlayers([]);
      fetchGames();
      alert('Results recorded successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Error recording results');
    }
  };

  const handleResultChange = (playerId, result) => {
    setResults(results.filter(r => r.playerId !== playerId).concat([{ playerId, result }]));
  };

  const initializeGames = async () => {
    if (window.confirm('This will initialize all 10 games. Continue?')) {
      try {
        await api.post('/api/game/initialize');
        alert('Games initialized successfully!');
        fetchGames();
      } catch (error) {
        alert(error.response?.data?.message || 'Error initializing games');
      }
    }
  };

  const handleAddGame = () => {
    setGameFormData({
      gameId: '',
      gameName: '',
      description: '',
      entryCost: 1,
      maxPoints: 3,
      type: 'single'
    });
    setShowAddGameModal(true);
  };

  const handleEditGame = (game) => {
    setGameFormData({
      gameId: game.gameId,
      gameName: game.gameName,
      description: game.description || '',
      entryCost: game.entryCost,
      maxPoints: game.maxPoints,
      type: game.type
    });
    setShowEditGameModal(true);
  };

  const handleSaveGame = async (e) => {
    e.preventDefault();
    try {
      if (showAddGameModal) {
        // Create new game
        await api.post('/api/game/create', gameFormData);
        alert('Game created successfully!');
        setShowAddGameModal(false);
      } else {
        // Update existing game
        await api.put(`/api/game/update/${gameFormData.gameId}`, {
          gameName: gameFormData.gameName,
          description: gameFormData.description,
          entryCost: gameFormData.entryCost,
          maxPoints: gameFormData.maxPoints,
          type: gameFormData.type
        });
        alert('Game updated successfully!');
        setShowEditGameModal(false);
      }
      setGameFormData({
        gameId: '',
        gameName: '',
        description: '',
        entryCost: 1,
        maxPoints: 3,
        type: 'single'
      });
      fetchGames();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving game');
    }
  };

  const handleDeleteGame = async (gameId) => {
    if (window.confirm(`Are you sure you want to delete game ${gameId}? This action cannot be undone.`)) {
      try {
        await api.delete(`/api/game/${gameId}`);
        alert('Game deleted successfully!');
        if (selectedGame?.gameId === gameId) {
          setSelectedGame(null);
        }
        fetchGames();
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting game');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-400">Loading games...</div>;
  }

  const getPlayerGameAttempts = (playerId, gameId) => {
    const player = players.find(p => p.playerId === playerId);
    if (!player) return { attempts: 0, wins: 0, losses: 0, canPlay: false };
    
    const attempts = player.gameHistory.filter(h => h.gameId === gameId);
    const wins = attempts.filter(h => h.result === 'Win').length;
    const losses = attempts.filter(h => h.result === 'Lose').length;
    const canPlay = attempts.length === 0 || (attempts.length === 1 && losses === 1);
    
    return { attempts: attempts.length, wins, losses, canPlay };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-orbitron font-bold text-neonBlue">Game Management</h2>
        <div className="flex space-x-3">
          <button
            onClick={handleAddGame}
            className="px-6 py-2 bg-electricPurple hover:glow-purple rounded-md font-medium transition-all"
          >
            + Add New Game
          </button>
          {gameTemplates.length === 0 && (
            <button
              onClick={initializeGames}
              className="px-6 py-2 bg-neonBlue hover:glow-blue rounded-md font-medium transition-all"
            >
              Initialize Default Games
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-neonBlue">
        <button
          onClick={() => setActiveTab('templates')}
          className={`px-6 py-3 font-medium transition-all ${
            activeTab === 'templates'
              ? 'text-neonBlue border-b-2 border-neonBlue glow-blue'
              : 'text-gray-400 hover:text-neonBlue'
          }`}
        >
          Game Templates ({gameTemplates.length})
        </button>
        <button
          onClick={() => setActiveTab('active')}
          className={`px-6 py-3 font-medium transition-all ${
            activeTab === 'active'
              ? 'text-neonBlue border-b-2 border-neonBlue glow-blue'
              : 'text-gray-400 hover:text-neonBlue'
          }`}
        >
          Active Games ({activeGames.length})
        </button>
      </div>

      {gameTemplates.length === 0 && activeTab === 'templates' && (
        <div className="bg-darkCard border border-neonBlue rounded-lg p-6 text-center">
          <p className="text-gray-400 mb-4">No games found. Add a new game or initialize default games.</p>
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {gameTemplates.map((game) => (
          <motion.div
            key={game._id || game.gameId}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`bg-darkCard border-2 rounded-lg p-4 transition-all ${
              selectedGame?.gameId === game.gameId && activeTab === 'templates'
                ? 'border-neonBlue glow-blue'
                : 'border-gray-700 hover:border-neonBlue'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 
                className="text-lg font-orbitron font-bold text-neonBlue cursor-pointer"
                onClick={() => handleGameSelect(game)}
              >
                {game.gameName}
              </h3>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 rounded text-xs bg-green-900 text-green-300">
                  Available
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditGame(game);
                  }}
                  className="text-neonBlue hover:text-blue-400 text-sm transition-colors"
                  title="Edit Game"
                >
                  ✏️
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteGame(game.gameId);
                  }}
                  className="text-red-400 hover:text-red-300 text-sm transition-colors"
                  title="Delete Game"
                >
                  🗑️
                </button>
              </div>
            </div>
            <div 
              className="text-sm text-gray-400 space-y-1 cursor-pointer"
              onClick={() => handleGameSelect(game)}
            >
              <p>ID: <span className="text-neonBlue font-medium">{game.gameId}</span></p>
              <p>Type: <span className="text-neonBlue">{game.type}</span> ({game.type === 'single' ? '1 player' : '2 players'})</p>
              <p>Entry Cost: <span className="text-electricPurple">{game.entryCost} coins</span></p>
              <p>Max Points: <span className="text-electricPurple">{game.maxPoints}</span></p>
              <p className="text-xs text-neonBlue mt-2 font-medium">✨ Click to start a new instance (can start multiple times)</p>
            </div>
          </motion.div>
        ))}
        </div>
      )}

      {activeTab === 'active' && (
        <div className="space-y-4">
          {activeGames.length === 0 ? (
            <div className="bg-darkCard border border-neonBlue rounded-lg p-6 text-center">
              <p className="text-gray-400">No active games. Start a game from templates.</p>
            </div>
          ) : (
            activeGames.map((game) => (
              <motion.div
                key={game._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-darkCard border-2 rounded-lg p-4 transition-all ${
                  selectedGame?._id === game._id
                    ? 'border-neonBlue glow-blue'
                    : 'border-gray-700 hover:border-neonBlue'
                }`}
                onClick={() => setSelectedGame(game)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-orbitron font-bold text-neonBlue">{game.gameName}</h3>
                    <p className="text-sm text-gray-400">Instance ID: {game._id.substring(0, 8)}...</p>
                    <p className="text-sm text-gray-400 mt-1">Players: {game.playersInvolved.join(', ')}</p>
                    <p className="text-xs text-yellow-400 mt-2">Started: {new Date(game.timestamp).toLocaleString()}</p>
                  </div>
                  <span className="px-2 py-1 rounded text-xs bg-yellow-900 text-yellow-300">Active</span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {selectedGame && (
        <div className="bg-darkCard border-2 border-neonBlue rounded-lg p-6 glow-blue">
          <h3 className="text-2xl font-orbitron font-bold text-neonBlue mb-4">
            Control: {selectedGame.gameName}
          </h3>

          {activeTab === 'templates' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Player{selectedGame.type === 'faceoff' ? 's' : ''} ({selectedGame.type === 'faceoff' ? '2 required' : '1 required'})
                </label>
                <div className="mb-3 flex items-center gap-3">
                  <input
                    type="text"
                    value={playerSearch}
                    onChange={(e) => setPlayerSearch(e.target.value)}
                    placeholder="Search by Player ID or Name..."
                    className="w-full max-w-md px-4 py-2 bg-darkBg border border-neonBlue rounded-md text-white focus:outline-none focus:glow-blue"
                  />
                  {playerSearch && (
                    <button
                      onClick={() => setPlayerSearch('')}
                      className="px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded-md"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                  {filteredPlayers.map((player) => {
                    const attempts = getPlayerGameAttempts(player.playerId, selectedGame.gameId);
                    const canSelect = attempts.canPlay && player.tokens >= selectedGame.entryCost;
                    
                    return (
                      <button
                        key={player._id}
                        onClick={() => canSelect && handlePlayerSelect(player.playerId)}
                        disabled={!canSelect}
                        className={`p-2 rounded border transition-all text-left ${
                          selectedPlayers.includes(player.playerId)
                            ? 'bg-neonBlue border-neonBlue text-white'
                            : canSelect
                            ? 'bg-darkBg border-gray-700 text-gray-300 hover:border-neonBlue'
                            : 'bg-gray-900 border-gray-800 text-gray-600 opacity-50 cursor-not-allowed'
                        }`}
                        title={!canSelect ? (attempts.attempts >= 2 ? 'Max attempts reached' : 'Not enough tokens or already won') : ''}
                      >
                        <div className="text-xs font-medium">{player.playerId}</div>
                        <div className="text-xs text-gray-400">{player.name}</div>
                        <div className="text-xs text-electricPurple">Tokens: {player.tokens}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Attempts: {attempts.attempts}/2
                          {attempts.wins > 0 && <span className="text-green-400"> (Won)</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  Selected: {selectedPlayers.join(', ') || 'None'}
                </p>
              </div>

              <button
                onClick={handleStartGame}
                disabled={selectedPlayers.length !== (selectedGame.type === 'faceoff' ? 2 : 1)}
                className="px-6 py-3 bg-neonBlue hover:glow-blue rounded-md font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Start Game
              </button>
            </div>
          )}

          {selectedGame.status === 'active' && (
            <div className="space-y-4">
              <p className="text-gray-300">
                Players involved: <span className="text-neonBlue font-medium">{selectedGame.playersInvolved.join(', ')}</span>
              </p>
              <button
                onClick={() => setShowResultModal(true)}
                className="px-6 py-3 bg-electricPurple hover:glow-purple rounded-md font-medium transition-all"
              >
                Mark Results
              </button>
            </div>
          )}

          {selectedGame.status === 'completed' && (
            <div className="space-y-2">
              <p className="text-green-400 font-medium">Game Completed</p>
              <div className="text-sm text-gray-400">
                <p>Players: {selectedGame.playersInvolved.join(', ')}</p>
                <div className="mt-2">
                  Results:
                  {selectedGame.results.map((result, idx) => (
                    <div key={idx} className="ml-4">
                      {result.playerId}: <span className={result.result === 'Win' ? 'text-green-400' : 'text-red-400'}>{result.result}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Results Modal */}
      {showResultModal && selectedGame && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-darkCard border-2 border-neonBlue rounded-lg p-6 max-w-md w-full glow-blue"
          >
            <h3 className="text-2xl font-orbitron font-bold text-neonBlue mb-4">
              Mark Results: {selectedGame.gameName}
            </h3>
            <div className="space-y-4">
              {selectedGame.playersInvolved.map((playerId) => {
                const player = players.find(p => p.playerId === playerId);
                const currentResult = results.find(r => r.playerId === playerId);
                return (
                  <div key={playerId} className="bg-darkBg p-4 rounded border border-gray-700">
                    <p className="text-sm font-medium text-gray-300 mb-2">
                      {player?.name || playerId} ({playerId})
                    </p>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleResultChange(playerId, 'Win')}
                        className={`flex-1 py-2 rounded font-medium transition-all ${
                          currentResult?.result === 'Win'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-green-700'
                        }`}
                      >
                        Win
                      </button>
                      <button
                        onClick={() => handleResultChange(playerId, 'Lose')}
                        className={`flex-1 py-2 rounded font-medium transition-all ${
                          currentResult?.result === 'Lose'
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-red-700'
                        }`}
                      >
                        Lose
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleMarkResults}
                disabled={results.length !== selectedGame.playersInvolved.length}
                className="flex-1 py-2 bg-neonBlue hover:glow-blue rounded-md font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Results
              </button>
              <button
                onClick={() => {
                  setShowResultModal(false);
                  setResults([]);
                }}
                className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded-md font-medium transition-all"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Game Modal */}
      {showAddGameModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-darkCard border-2 border-neonBlue rounded-lg p-6 max-w-md w-full glow-blue"
          >
            <h3 className="text-2xl font-orbitron font-bold text-neonBlue mb-4">
              Add New Game
            </h3>
            <form onSubmit={handleSaveGame} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Game ID *</label>
                <input
                  type="text"
                  value={gameFormData.gameId}
                  onChange={(e) => setGameFormData({ ...gameFormData, gameId: e.target.value.toUpperCase() })}
                  required
                  placeholder="e.g., G11"
                  className="w-full px-4 py-2 bg-darkBg border border-neonBlue rounded-md text-white focus:outline-none focus:glow-blue"
                />
                <p className="text-xs text-gray-400 mt-1">Unique identifier (e.g., G11, G12)</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Game Name *</label>
                <input
                  type="text"
                  value={gameFormData.gameName}
                  onChange={(e) => setGameFormData({ ...gameFormData, gameName: e.target.value })}
                  required
                  placeholder="e.g., Puzzle Challenge"
                  className="w-full px-4 py-2 bg-darkBg border border-neonBlue rounded-md text-white focus:outline-none focus:glow-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={gameFormData.description}
                  onChange={(e) => setGameFormData({ ...gameFormData, description: e.target.value })}
                  placeholder="Describe the game rules and objectives..."
                  rows="3"
                  className="w-full px-4 py-2 bg-darkBg border border-neonBlue rounded-md text-white focus:outline-none focus:glow-blue resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">This description will be shown on the public games page</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Game Type *</label>
                <select
                  value={gameFormData.type}
                  onChange={(e) => setGameFormData({ ...gameFormData, type: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-darkBg border border-neonBlue rounded-md text-white focus:outline-none focus:glow-blue"
                >
                  <option value="single">Single Player (1 player)</option>
                  <option value="faceoff">Faceoff (2 players)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Entry Cost (coins) *</label>
                  <input
                    type="number"
                    value={gameFormData.entryCost}
                    onChange={(e) => setGameFormData({ ...gameFormData, entryCost: parseInt(e.target.value) || 0 })}
                    required
                    min="0"
                    className="w-full px-4 py-2 bg-darkBg border border-neonBlue rounded-md text-white focus:outline-none focus:glow-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Max Points *</label>
                  <input
                    type="number"
                    value={gameFormData.maxPoints}
                    onChange={(e) => setGameFormData({ ...gameFormData, maxPoints: parseInt(e.target.value) || 0 })}
                    required
                    min="0"
                    className="w-full px-4 py-2 bg-darkBg border border-neonBlue rounded-md text-white focus:outline-none focus:glow-blue"
                  />
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-neonBlue hover:glow-blue rounded-md font-medium transition-all"
                >
                  Create Game
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddGameModal(false)}
                  className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded-md font-medium transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Edit Game Modal */}
      {showEditGameModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-darkCard border-2 border-neonBlue rounded-lg p-6 max-w-md w-full glow-blue"
          >
            <h3 className="text-2xl font-orbitron font-bold text-neonBlue mb-4">
              Edit Game: {gameFormData.gameId}
            </h3>
            <form onSubmit={handleSaveGame} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Game Name *</label>
                <input
                  type="text"
                  value={gameFormData.gameName}
                  onChange={(e) => setGameFormData({ ...gameFormData, gameName: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-darkBg border border-neonBlue rounded-md text-white focus:outline-none focus:glow-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={gameFormData.description}
                  onChange={(e) => setGameFormData({ ...gameFormData, description: e.target.value })}
                  placeholder="Describe the game rules and objectives..."
                  rows="3"
                  className="w-full px-4 py-2 bg-darkBg border border-neonBlue rounded-md text-white focus:outline-none focus:glow-blue resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">This description will be shown on the public games page</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Game Type *</label>
                <select
                  value={gameFormData.type}
                  onChange={(e) => setGameFormData({ ...gameFormData, type: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-darkBg border border-neonBlue rounded-md text-white focus:outline-none focus:glow-blue"
                >
                  <option value="single">Single Player (1 player)</option>
                  <option value="faceoff">Faceoff (2 players)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Entry Cost (coins) *</label>
                  <input
                    type="number"
                    value={gameFormData.entryCost}
                    onChange={(e) => setGameFormData({ ...gameFormData, entryCost: parseInt(e.target.value) || 0 })}
                    required
                    min="0"
                    className="w-full px-4 py-2 bg-darkBg border border-neonBlue rounded-md text-white focus:outline-none focus:glow-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Max Points *</label>
                  <input
                    type="number"
                    value={gameFormData.maxPoints}
                    onChange={(e) => setGameFormData({ ...gameFormData, maxPoints: parseInt(e.target.value) || 0 })}
                    required
                    min="0"
                    className="w-full px-4 py-2 bg-darkBg border border-neonBlue rounded-md text-white focus:outline-none focus:glow-blue"
                  />
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-neonBlue hover:glow-blue rounded-md font-medium transition-all"
                >
                  Update Game
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditGameModal(false)}
                  className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded-md font-medium transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default GameControl;

