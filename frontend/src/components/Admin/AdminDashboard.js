import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PlayerManagement from './PlayerManagement';
import GameControl from './GameControl';
import AdminLeaderboard from './AdminLeaderboard';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('players');

  const tabs = [
    { id: 'players', label: 'Player Management' },
    { id: 'games', label: 'Game Control' },
    { id: 'leaderboard', label: 'Leaderboard' },
  ];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-orbitron font-bold neon-blue mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-400">Manage players, games, and view leaderboard</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 border-b border-neonBlue">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-medium transition-all ${
                activeTab === tab.id
                  ? 'text-neonBlue border-b-2 border-neonBlue glow-blue'
                  : 'text-gray-400 hover:text-neonBlue'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'players' && <PlayerManagement />}
          {activeTab === 'games' && <GameControl />}
          {activeTab === 'leaderboard' && <AdminLeaderboard />}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;

