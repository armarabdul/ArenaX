import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Admin/Login';
import AdminDashboard from './components/Admin/AdminDashboard';
import PlayerProfile from './components/Admin/PlayerProfile';
import PublicHome from './components/Public/PublicHome';
import PublicGames from './components/Public/PublicGames';
import PublicRules from './components/Public/PublicRules';
import PublicLeaderboard from './components/Public/PublicLeaderboard';
import PublicAbout from './components/Public/PublicAbout';
import Navbar from './components/Shared/Navbar';
import PublicPlayerProfile from './components/Public/PublicPlayerProfile';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/adminlogin" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-darkBg">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicHome />} />
            <Route path="/games" element={<PublicGames />} />
            <Route path="/rules" element={<PublicRules />} />
            <Route path="/leaderboard" element={<PublicLeaderboard />} />
            <Route path="/about" element={<PublicAbout />} />
            <Route path="/player/:playerId" element={<PublicPlayerProfile />} />
            
            {/* Admin Routes */}
            <Route path="/adminlogin" element={<Login />} />
            <Route 
              path="/admin/dashboard" 
              element={
                <PrivateRoute>
                  <AdminDashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/admin/player/:playerId" 
              element={
                <PrivateRoute>
                  <PlayerProfile />
                </PrivateRoute>
              } 
            />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

