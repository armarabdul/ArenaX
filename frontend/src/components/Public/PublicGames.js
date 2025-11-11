import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';

const PublicGames = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await api.get('/api/game/templates');
      setGames(response.data);
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setLoading(false);
    }
  };

  const gameIcons = {
    'G1': '🥤',
    'G2': '😄',
    'G3': '🚩',
    'G4': '⌨️',
    'G5': '🧠',
    'G6': '🔢',
    'G7': '📝',
    'G8': '⚡',
    'G9': '⭕',
    'G10': '✂️',
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Loading games...</div>
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
            ArenaX Games
          </h1>
          <p className="text-xl text-gray-400">
            Explore all 10 exciting mini-games in the competition
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game, index) => (
            <motion.div
              key={game._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-darkCard border-2 border-neonBlue rounded-lg p-6 hover:glow-blue transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-5xl">{gameIcons[game.gameId] || '🎮'}</div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Type</div>
                  <div className="text-sm font-medium text-neonBlue capitalize">{game.type}</div>
                </div>
              </div>
              
              <h3 className="text-2xl font-orbitron font-bold text-neonBlue mb-2">
                {game.gameName}
              </h3>
              
              <p className="text-gray-400 mb-4 text-sm">
                {game.description || 'An exciting game in the ArenaX competition!'}
              </p>

              <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                <div>
                  <div className="text-xs text-gray-500">Entry Cost</div>
                  <div className="text-lg font-bold text-electricPurple">{game.entryCost} 🪙</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Max Points</div>
                  <div className="text-lg font-bold text-neonBlue">{game.maxPoints} pts</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {games.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            Games are being set up. Check back soon!
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicGames;

