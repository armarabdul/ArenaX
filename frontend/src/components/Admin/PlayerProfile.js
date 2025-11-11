import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import io from 'socket.io-client';

const PlayerProfile = () => {
  const { playerId } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetchPlayer();
    fetchGames();

    const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');
    socket.on('playerUpdated', () => {
      fetchPlayer();
    });

    return () => socket.disconnect();
  }, [playerId]);

  const fetchPlayer = async () => {
    try {
      const response = await api.get(`/api/player/${playerId}`);
      setPlayer(response.data);
    } catch (error) {
      console.error('Error fetching player:', error);
      alert('Player not found');
      navigate('/admin/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchGames = async () => {
    try {
      const response = await api.get('/api/game/templates');
      setGames(response.data);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  const getGameStats = (gameId) => {
    if (!player) return { attempts: 0, wins: 0, losses: 0, totalPoints: 0 };
    
    const gameHistory = player.gameHistory.filter(h => h.gameId === gameId);
    return {
      attempts: gameHistory.length,
      wins: gameHistory.filter(h => h.result === 'Win').length,
      losses: gameHistory.filter(h => h.result === 'Lose').length,
      totalPoints: gameHistory.reduce((sum, h) => sum + h.points, 0)
    };
  };

  const getOverallStats = () => {
    if (!player) return null;
    
    const totalWins = player.gameHistory.filter(h => h.result === 'Win').length;
    const totalLosses = player.gameHistory.filter(h => h.result === 'Lose').length;
    const winRate = player.gamesPlayed > 0 ? ((totalWins / player.gamesPlayed) * 100).toFixed(1) : 0;
    
    return {
      totalWins,
      totalLosses,
      winRate,
      totalPoints: player.points,
      tokensRemaining: player.tokens,
      gamesPlayed: player.gamesPlayed,
      opponentsFaced: player.opponentsFaced.length
    };
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-400">Loading player profile...</div>;
  }

  if (!player) {
    return null;
  }

  const overallStats = getOverallStats();

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="text-neonBlue hover:text-blue-400 transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Player Info Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-darkCard border-2 border-neonBlue rounded-lg p-6 mb-6 glow-blue"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-orbitron font-bold text-neonBlue mb-2">
                {player.name}
              </h1>
              <div className="space-y-1 text-gray-300">
                <p><span className="text-neonBlue font-medium">Player ID:</span> {player.playerId}</p>
                <p><span className="text-neonBlue font-medium">Department:</span> {player.department}</p>
                <p><span className="text-neonBlue font-medium">Contact:</span> {player.contact}</p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-electricPurple">{player.points}</div>
                <div className="text-sm text-gray-400">Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-neonBlue">{player.tokens}</div>
                <div className="text-sm text-gray-400">Tokens</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{player.gamesPlayed}</div>
                <div className="text-sm text-gray-400">Games</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{player.opponentsFaced.length}</div>
                <div className="text-sm text-gray-400">Opponents</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Overall Stats */}
        {overallStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-darkCard border-2 border-electricPurple rounded-lg p-6 mb-6"
          >
            <h2 className="text-2xl font-orbitron font-bold text-electricPurple mb-4">
              Overall Statistics
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{overallStats.totalWins}</div>
                <div className="text-sm text-gray-400">Wins</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400">{overallStats.totalLosses}</div>
                <div className="text-sm text-gray-400">Losses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">{overallStats.winRate}%</div>
                <div className="text-sm text-gray-400">Win Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-neonBlue">{overallStats.totalPoints}</div>
                <div className="text-sm text-gray-400">Total Points</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Game History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-darkCard border-2 border-neonBlue rounded-lg p-6 mb-6"
        >
          <h2 className="text-2xl font-orbitron font-bold text-neonBlue mb-4">
            Game History
          </h2>
          {player.gameHistory.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No games played yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-darkBg">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-neonBlue">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-neonBlue">Game</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-neonBlue">Result</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-neonBlue">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {player.gameHistory
                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                    .map((history, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-darkBg transition-colors"
                      >
                        <td className="px-4 py-3 text-sm text-gray-300">
                          {new Date(history.timestamp).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-300">
                          {history.gameName} ({history.gameId})
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            history.result === 'Win'
                              ? 'bg-green-900 text-green-300'
                              : 'bg-red-900 text-red-300'
                          }`}>
                            {history.result}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm font-bold text-electricPurple">
                          {history.points} pts
                        </td>
                      </motion.tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Game-wise Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-darkCard border-2 border-neonBlue rounded-lg p-6"
        >
          <h2 className="text-2xl font-orbitron font-bold text-neonBlue mb-4">
            Game-wise Performance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {games.map((game) => {
              const stats = getGameStats(game.gameId);
              const canPlay = stats.attempts === 0 || (stats.attempts === 1 && stats.losses === 1);
              
              return (
                <div
                  key={game._id}
                  className="bg-darkBg border border-gray-700 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium text-neonBlue">{game.gameName}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${
                      canPlay ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-300'
                    }`}>
                      {canPlay ? 'Available' : 'Max Attempts'}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-400">
                    <p>Attempts: <span className="text-gray-300">{stats.attempts}/2</span></p>
                    <p>Wins: <span className="text-green-400">{stats.wins}</span></p>
                    <p>Losses: <span className="text-red-400">{stats.losses}</span></p>
                    <p>Points: <span className="text-electricPurple">{stats.totalPoints}</span></p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PlayerProfile;

