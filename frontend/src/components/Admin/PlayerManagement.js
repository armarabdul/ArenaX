import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import io from 'socket.io-client';

const PlayerManagement = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    contact: '',
    tokens: 10,
    points: 0,
    gamesPlayed: 0,
  });

  useEffect(() => {
    fetchPlayers();

    // Socket connection for real-time updates
    const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');
    socket.on('playerUpdated', () => {
      fetchPlayers();
    });

    return () => socket.disconnect();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await api.get('/api/player');
      setPlayers(response.data);
    } catch (error) {
      console.error('Error fetching players:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/player/add', {
        name: formData.name,
        department: formData.department,
        contact: formData.contact,
      });
      setShowAddModal(false);
      setFormData({ name: '', department: '', contact: '', tokens: 10, points: 0, gamesPlayed: 0 });
      fetchPlayers();
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding player');
    }
  };

  const handleEdit = (player) => {
    setEditingPlayer(player);
    setFormData({
      name: player.name,
      department: player.department,
      contact: player.contact,
      tokens: player.tokens,
      points: player.points,
      gamesPlayed: player.gamesPlayed,
    });
    setShowAddModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/player/update/${editingPlayer.playerId}`, formData);
      setShowAddModal(false);
      setEditingPlayer(null);
      setFormData({ name: '', department: '', contact: '', tokens: 10, points: 0, gamesPlayed: 0 });
      fetchPlayers();
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating player');
    }
  };

  const handleDelete = async (playerId) => {
    if (window.confirm('Are you sure you want to delete this player?')) {
      try {
        await api.delete(`/api/player/${playerId}`);
        fetchPlayers();
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting player');
      }
    }
  };

  const filteredPlayers = players.filter(
    (player) =>
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.playerId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-12 text-gray-400">Loading players...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search by name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 bg-darkCard border border-neonBlue rounded-md text-white focus:outline-none focus:glow-blue w-64"
        />
        <button
          onClick={() => {
            setEditingPlayer(null);
            setFormData({ name: '', department: '', contact: '', tokens: 10, points: 0, gamesPlayed: 0 });
            setShowAddModal(true);
          }}
          className="px-6 py-2 bg-neonBlue hover:glow-blue rounded-md font-medium transition-all"
        >
          Add Player
        </button>
      </div>

      <div className="bg-darkCard rounded-lg border border-neonBlue overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-darkBg">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neonBlue uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neonBlue uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neonBlue uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neonBlue uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neonBlue uppercase tracking-wider">Tokens</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neonBlue uppercase tracking-wider">Points</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neonBlue uppercase tracking-wider">Games</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neonBlue uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredPlayers.map((player) => (
                <motion.tr
                  key={player._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-darkBg transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neonBlue">{player.playerId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{player.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{player.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{player.contact}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{player.tokens}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-electricPurple">{player.points}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{player.gamesPlayed}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button
                      onClick={() => navigate(`/admin/player/${player.playerId}`)}
                      className="text-electricPurple hover:text-purple-400 transition-colors"
                      title="View Profile"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => handleEdit(player)}
                      className="text-neonBlue hover:text-blue-400 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(player.playerId)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-darkCard border-2 border-neonBlue rounded-lg p-6 max-w-md w-full glow-blue"
          >
            <h3 className="text-2xl font-orbitron font-bold text-neonBlue mb-4">
              {editingPlayer ? 'Edit Player' : 'Add New Player'}
            </h3>
            <form onSubmit={editingPlayer ? handleUpdate : handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-darkBg border border-neonBlue rounded-md text-white focus:outline-none focus:glow-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Department</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-darkBg border border-neonBlue rounded-md text-white focus:outline-none focus:glow-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Contact</label>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-darkBg border border-neonBlue rounded-md text-white focus:outline-none focus:glow-blue"
                />
              </div>
              {editingPlayer && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Tokens</label>
                    <input
                      type="number"
                      value={formData.tokens}
                      onChange={(e) => setFormData({ ...formData, tokens: parseInt(e.target.value) })}
                      min="0"
                      className="w-full px-4 py-2 bg-darkBg border border-neonBlue rounded-md text-white focus:outline-none focus:glow-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Points</label>
                    <input
                      type="number"
                      value={formData.points}
                      onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                      min="0"
                      className="w-full px-4 py-2 bg-darkBg border border-neonBlue rounded-md text-white focus:outline-none focus:glow-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Games Played</label>
                    <input
                      type="number"
                      value={formData.gamesPlayed}
                      onChange={(e) => setFormData({ ...formData, gamesPlayed: parseInt(e.target.value) })}
                      min="0"
                      className="w-full px-4 py-2 bg-darkBg border border-neonBlue rounded-md text-white focus:outline-none focus:glow-blue"
                    />
                  </div>
                </>
              )}
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-neonBlue hover:glow-blue rounded-md font-medium transition-all"
                >
                  {editingPlayer ? 'Update' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingPlayer(null);
                  }}
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

export default PlayerManagement;

