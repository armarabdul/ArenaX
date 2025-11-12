import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../utils/api';

const PublicPlayerProfile = () => {
  const { playerId } = useParams();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlayer = async () => {
      setError('');
      setLoading(true);
      try {
        const res = await api.get(`/api/player/public/${playerId}`);
        setPlayer(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Player not found');
      } finally {
        setLoading(false);
      }
    };
    fetchPlayer();
  }, [playerId]);

  if (loading) {
    return <div className="text-center py-12 text-gray-400">Loading player...</div>;
  }

  if (error || !player) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-red-400 mb-4">{error || 'Player not found'}</p>
        <Link to="/leaderboard" className="text-neonBlue hover:underline">Back to Leaderboard</Link>
      </div>
    );
  }

  const totalWins = player.gameHistory?.filter((h) => h.result === 'Win').length || 0;
  const totalLosses = player.gameHistory?.filter((h) => h.result === 'Lose').length || 0;
  const winRate = player.gamesPlayed > 0 ? Math.round((totalWins / player.gamesPlayed) * 100) : 0;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-orbitron font-bold text-neonBlue">
            {player.name} <span className="text-sm md:text-base text-gray-400">({player.playerId})</span>
          </h1>
          <Link to="/leaderboard" className="text-sm text-neonBlue hover:underline">Back to Leaderboard</Link>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-darkCard border border-neonBlue rounded-lg p-4 text-center">
            <div className="text-xl md:text-2xl font-bold text-electricPurple">{player.points}</div>
            <div className="text-xs text-gray-400">Points</div>
          </div>
          <div className="bg-darkCard border border-neonBlue rounded-lg p-4 text-center">
            <div className="text-xl md:text-2xl font-bold text-neonBlue">{player.tokens}</div>
            <div className="text-xs text-gray-400">Tokens</div>
          </div>
          <div className="bg-darkCard border border-neonBlue rounded-lg p-4 text-center">
            <div className="text-xl md:text-2xl font-bold text-yellow-400">{player.gamesPlayed}</div>
            <div className="text-xs text-gray-400">Games Played</div>
          </div>
          <div className="bg-darkCard border border-neonBlue rounded-lg p-4 text-center">
            <div className="text-xl md:text-2xl font-bold text-green-400">{winRate}%</div>
            <div className="text-xs text-gray-400">Win Rate</div>
          </div>
        </div>

        {/* Game History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-darkCard border-2 border-neonBlue rounded-lg p-6"
        >
          <h2 className="text-2xl font-orbitron font-bold text-neonBlue mb-4">Game History</h2>
          {(!player.gameHistory || player.gameHistory.length === 0) ? (
            <p className="text-gray-400">No games played yet.</p>
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
                    .slice()
                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                    .map((h, idx) => (
                      <tr key={idx} className="hover:bg-darkBg">
                        <td className="px-4 py-3 text-sm text-gray-300">{new Date(h.timestamp).toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-gray-300">{h.gameName} ({h.gameId})</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${h.result === 'Win' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                            {h.result}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm font-bold text-electricPurple">{h.points}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PublicPlayerProfile;
