import React from 'react';
import { motion } from 'framer-motion';

const PublicRules = () => {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-orbitron font-bold neon-blue mb-4">
            ArenaX Rules
          </h1>
          <p className="text-xl text-gray-400">
            Everything you need to know about the competition
          </p>
        </motion.div>

        <div className="space-y-8">
          {/* Coin System */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-darkCard border-2 border-neonBlue rounded-lg p-6"
          >
            <h2 className="text-2xl font-orbitron font-bold text-neonBlue mb-4 flex items-center">
              <span className="mr-3">🪙</span> Coin System
            </h2>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start">
                <span className="text-neonBlue mr-2">•</span>
                <span>Each participant starts with <strong className="text-electricPurple">10 coins</strong></span>
              </li>
              <li className="flex items-start">
                <span className="text-neonBlue mr-2">•</span>
                <span>Games have an <strong className="text-electricPurple">entry cost</strong> (1-2 coins depending on the game)</span>
              </li>
              <li className="flex items-start">
                <span className="text-neonBlue mr-2">•</span>
                <span>You must have enough coins to enter a game</span>
              </li>
              <li className="flex items-start">
                <span className="text-neonBlue mr-2">•</span>
                <span>If you <strong className="text-green-400">win</strong>, you get your entry coins <strong className="text-green-400">refunded</strong> plus points</span>
              </li>
              <li className="flex items-start">
                <span className="text-neonBlue mr-2">•</span>
                <span>If you <strong className="text-red-400">lose</strong>, you <strong className="text-red-400">lose</strong> the entry coins</span>
              </li>
            </ul>
          </motion.div>

          {/* Scoring System */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-darkCard border-2 border-neonBlue rounded-lg p-6"
          >
            <h2 className="text-2xl font-orbitron font-bold text-neonBlue mb-4 flex items-center">
              <span className="mr-3">🏆</span> Scoring System
            </h2>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start">
                <span className="text-neonBlue mr-2">•</span>
                <span>Each game awards <strong className="text-electricPurple">points</strong> when you win</span>
              </li>
              <li className="flex items-start">
                <span className="text-neonBlue mr-2">•</span>
                <span>Single-player games: <strong className="text-neonBlue">3 points</strong> per win</span>
              </li>
              <li className="flex items-start">
                <span className="text-neonBlue mr-2">•</span>
                <span>Faceoff games: <strong className="text-neonBlue">5 points</strong> per win</span>
              </li>
              <li className="flex items-start">
                <span className="text-neonBlue mr-2">•</span>
                <span>Leaderboard is ranked by <strong className="text-electricPurple">total points</strong> (descending)</span>
              </li>
              <li className="flex items-start">
                <span className="text-neonBlue mr-2">•</span>
                <span>In case of ties, players with fewer games played rank higher</span>
              </li>
            </ul>
          </motion.div>

          {/* Game Rules */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-darkCard border-2 border-neonBlue rounded-lg p-6"
          >
            <h2 className="text-2xl font-orbitron font-bold text-neonBlue mb-4 flex items-center">
              <span className="mr-3">🎮</span> Game Rules
            </h2>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start">
                <span className="text-neonBlue mr-2">•</span>
                <span>There are <strong className="text-electricPurple">10 mini-games</strong> in total</span>
              </li>
              <li className="flex items-start">
                <span className="text-neonBlue mr-2">•</span>
                <span>You can play each game <strong className="text-neonBlue">once</strong> (with one retry if you lose)</span>
              </li>
              <li className="flex items-start">
                <span className="text-neonBlue mr-2">•</span>
                <span>Games are either <strong className="text-neonBlue">single-player</strong> or <strong className="text-neonBlue">faceoff</strong> (2 players)</span>
              </li>
              <li className="flex items-start">
                <span className="text-neonBlue mr-2">•</span>
                <span>Admin assigns players to games and marks results</span>
              </li>
              <li className="flex items-start">
                <span className="text-neonBlue mr-2">•</span>
                <span>Your game history and opponents are tracked automatically</span>
              </li>
            </ul>
          </motion.div>

          {/* Leaderboard */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-darkCard border-2 border-neonBlue rounded-lg p-6"
          >
            <h2 className="text-2xl font-orbitron font-bold text-neonBlue mb-4 flex items-center">
              <span className="mr-3">📊</span> Leaderboard
            </h2>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start">
                <span className="text-neonBlue mr-2">•</span>
                <span>The leaderboard updates <strong className="text-electricPurple">automatically</strong> every 5 seconds</span>
              </li>
              <li className="flex items-start">
                <span className="text-neonBlue mr-2">•</span>
                <span>Top 3 players are highlighted in <strong className="text-yellow-400">Gold</strong>, <strong className="text-gray-300">Silver</strong>, and <strong className="text-orange-600">Bronze</strong></span>
              </li>
              <li className="flex items-start">
                <span className="text-neonBlue mr-2">•</span>
                <span>You can view the leaderboard at any time on the public page</span>
              </li>
            </ul>
          </motion.div>

          {/* Important Notes */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0 }}
            className="bg-darkCard border-2 border-electricPurple rounded-lg p-6 glow-purple"
          >
            <h2 className="text-2xl font-orbitron font-bold text-electricPurple mb-4 flex items-center">
              <span className="mr-3">⚠️</span> Important Notes
            </h2>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start">
                <span className="text-electricPurple mr-2">•</span>
                <span>All game results are final once marked by the admin</span>
              </li>
              <li className="flex items-start">
                <span className="text-electricPurple mr-2">•</span>
                <span>Make sure you have enough coins before entering a game</span>
              </li>
              <li className="flex items-start">
                <span className="text-electricPurple mr-2">•</span>
                <span>Strategy matters! Choose which games to play wisely</span>
              </li>
              <li className="flex items-start">
                <span className="text-electricPurple mr-2">•</span>
                <span>Have fun and good luck! 🍀</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PublicRules;

