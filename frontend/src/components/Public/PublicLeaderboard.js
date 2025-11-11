import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import io from 'socket.io-client';

const PublicLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();

    const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');
    socket.on('playerUpdated', () => {
      fetchLeaderboard();
    });

    const interval = setInterval(fetchLeaderboard, 5000);

    return () => {
      socket.disconnect();
      clearInterval(interval);
    };
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await api.get('/api/leaderboard');
      setLeaderboard(response.data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankColor = (rank) => {
    if (rank === 1) return 'text-yellow-400 border-yellow-400';
    if (rank === 2) return 'text-gray-300 border-gray-400';
    if (rank === 3) return 'text-orange-600 border-orange-600';
    return 'text-gray-400 border-gray-700';
  };

  const getRankBg = (rank) => {
    if (rank === 1) return 'bg-yellow-900 bg-opacity-30';
    if (rank === 2) return 'bg-gray-800 bg-opacity-30';
    if (rank === 3) return 'bg-orange-900 bg-opacity-30';
    return 'bg-darkBg';
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Loading leaderboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-orbitron font-bold neon-blue mb-4">
            Live Leaderboard
          </h1>
          <p className="text-xl text-gray-400">
            Rankings update automatically every 5 seconds
          </p>
        </motion.div>

        <div className="bg-darkCard rounded-lg border-2 border-neonBlue overflow-hidden glow-blue">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-darkBg">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-neonBlue uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-neonBlue uppercase tracking-wider">Player ID</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-neonBlue uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-neonBlue uppercase tracking-wider">Department</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-neonBlue uppercase tracking-wider">Points</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-neonBlue uppercase tracking-wider">Tokens</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-neonBlue uppercase tracking-wider">Games</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {leaderboard.map((entry, index) => (
                  <motion.tr
                    key={entry.playerId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`hover:bg-darkBg transition-colors ${getRankBg(entry.rank)}`}
                  >
                    <td className={`px-6 py-4 whitespace-nowrap text-lg font-bold border-l-4 ${getRankColor(entry.rank)}`}>
                      <div className="flex items-center">
                        {getRankIcon(entry.rank) && <span className="mr-2 text-2xl">{getRankIcon(entry.rank)}</span>}
                        <span>#{entry.rank}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neonBlue">{entry.playerId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-medium">{entry.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{entry.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-electricPurple">{entry.points}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{entry.tokens}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{entry.gamesPlayed}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {leaderboard.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No players yet. Check back soon!
          </div>
        )}

        {/* Top 3 Highlight */}
        {leaderboard.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {leaderboard.slice(0, 3).map((entry, index) => (
              <motion.div
                key={entry.playerId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className={`bg-darkCard border-2 rounded-lg p-6 text-center ${
                  entry.rank === 1 ? 'border-yellow-400 glow-blue' :
                  entry.rank === 2 ? 'border-gray-400' :
                  'border-orange-600'
                }`}
              >
                <div className="text-4xl mb-2">
                  {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'}
                </div>
                <div className={`text-2xl font-bold mb-2 ${
                  entry.rank === 1 ? 'text-yellow-400' :
                  entry.rank === 2 ? 'text-gray-300' :
                  'text-orange-600'
                }`}>
                  {entry.name}
                </div>
                <div className="text-sm text-gray-400 mb-2">{entry.playerId}</div>
                <div className="text-3xl font-bold text-electricPurple">{entry.points} pts</div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicLeaderboard;

