import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import io from 'socket.io-client';

const AdminLeaderboard = () => {
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

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset the entire leaderboard? This will reset all players to initial state.')) {
      try {
        await api.put('/api/admin/reset');
        alert('Leaderboard reset successfully!');
        fetchLeaderboard();
      } catch (error) {
        alert(error.response?.data?.message || 'Error resetting leaderboard');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-400">Loading leaderboard...</div>;
  }

  const getRankColor = (rank) => {
    if (rank === 1) return 'text-yellow-400 border-yellow-400';
    if (rank === 2) return 'text-gray-300 border-gray-400';
    if (rank === 3) return 'text-orange-600 border-orange-600';
    return 'text-gray-400 border-gray-700';
  };

  const getRankBg = (rank) => {
    if (rank === 1) return 'bg-yellow-900 bg-opacity-20';
    if (rank === 2) return 'bg-gray-800 bg-opacity-20';
    if (rank === 3) return 'bg-orange-900 bg-opacity-20';
    return 'bg-darkBg';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-orbitron font-bold text-neonBlue">Live Leaderboard</h2>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md font-medium transition-all"
        >
          Reset Leaderboard
        </button>
      </div>

      <div className="bg-darkCard rounded-lg border border-neonBlue overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-darkBg">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neonBlue uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neonBlue uppercase tracking-wider">Player ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neonBlue uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neonBlue uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neonBlue uppercase tracking-wider">Points</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neonBlue uppercase tracking-wider">Tokens</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neonBlue uppercase tracking-wider">Games</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {leaderboard.map((entry) => (
                <motion.tr
                  key={entry.playerId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`hover:bg-darkBg transition-colors ${getRankBg(entry.rank)}`}
                >
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold border-l-4 ${getRankColor(entry.rank)}`}>
                    #{entry.rank}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neonBlue">{entry.playerId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{entry.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{entry.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-electricPurple">{entry.points}</td>
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
          No players yet. Add players to see the leaderboard.
        </div>
      )}
    </div>
  );
};

export default AdminLeaderboard;

