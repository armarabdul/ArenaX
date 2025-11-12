import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [playerQuery, setPlayerQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const desktopSearchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  let debounceTimer = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const publicLinks = [
    { path: '/', label: 'Home' },
    { path: '/games', label: 'Games' },
    { path: '/rules', label: 'Rules' },
    { path: '/leaderboard', label: 'Leaderboard' },
    { path: '/about', label: 'About' },
  ];

  const idPattern = /^[a-zA-Z]{2,}\d{1,}$/; // e.g., ARX003

  const navigateToPlayer = (playerId) => {
    if (!playerId) return;
    navigate(`/player/${playerId.toUpperCase()}`);
    setPlayerQuery('');
    setShowSuggestions(false);
    setIsMenuOpen(false);
  };

  const submitPlayerSearch = async () => {
    const q = playerQuery.trim();
    if (!q) return;

    if (idPattern.test(q)) {
      navigateToPlayer(q);
      return;
    }

    // If it's a name, open suggestions list (if not already open)
    setShowSuggestions(true);
    if (suggestions.length === 1) {
      navigateToPlayer(suggestions[0].playerId);
    }
  };

  // Debounced fetch for typeahead (name or partial ID)
  useEffect(() => {
    const q = playerQuery.trim();
    if (!q || idPattern.test(q)) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoadingSuggestions(true);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      try {
        const res = await api.get('/api/player/public', { params: { q } });
        const list = (res.data || []).slice(0, 8); // cap suggestions
        setSuggestions(list);
        setShowSuggestions(true);
      } catch (e) {
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 250);

    return () => debounceTimer.current && clearTimeout(debounceTimer.current);
  }, [playerQuery]);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (
        desktopSearchRef.current && !desktopSearchRef.current.contains(e.target) &&
        mobileSearchRef.current && !mobileSearchRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const SuggestionList = ({ isMobile }) => {
    if (!showSuggestions || !playerQuery.trim() || idPattern.test(playerQuery.trim())) return null;
    if (loadingSuggestions) {
      return (
        <div className={`${isMobile ? '' : 'absolute'} mt-1 bg-darkBg border border-neonBlue rounded-md w-full z-50`}>
          <div className="px-3 py-2 text-sm text-gray-400">Searching...</div>
        </div>
      );
    }
    if (suggestions.length === 0) {
      return (
        <div className={`${isMobile ? '' : 'absolute'} mt-1 bg-darkBg border border-neonBlue rounded-md w-full z-50`}>
          <div className="px-3 py-2 text-sm text-gray-400">No matches</div>
        </div>
      );
    }
    return (
      <div className={`${isMobile ? '' : 'absolute'} mt-1 bg-darkBg border border-neonBlue rounded-md w-full z-50 max-h-64 overflow-y-auto`}> 
        {suggestions.map((p) => (
          <button
            key={p.playerId}
            onClick={() => navigateToPlayer(p.playerId)}
            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-800 flex items-center justify-between"
          >
            <span className="text-gray-200">{p.name}</span>
            <span className="text-neonBlue font-medium ml-3">{p.playerId}</span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <nav className="bg-darkCard border-b-2 border-neonBlue sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            {logoError ? (
              <span className="text-2xl font-orbitron font-bold neon-blue">ARENAX</span>
            ) : (
              <img 
                src="/logo.png" 
                alt="ARXENA Logo" 
                className="h-14 md:h-16 lg:h-20 w-auto object-contain"
                onError={() => setLogoError(true)}
              />
            )}
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {!isAuthenticated && publicLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? 'text-neonBlue glow-blue bg-opacity-20'
                    : 'text-gray-300 hover:text-neonBlue'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Public Player Search */}
            {!isAuthenticated && (
              <div className="relative" ref={desktopSearchRef}>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={playerQuery}
                    onChange={(e) => setPlayerQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && submitPlayerSearch()}
                    placeholder="Search Player ID or Name..."
                    className="px-3 py-2 bg-darkBg border border-neonBlue rounded-md text-sm text-white focus:outline-none focus:glow-blue w-56 lg:w-64"
                  />
                  <button
                    onClick={submitPlayerSearch}
                    className="px-3 py-2 bg-neonBlue hover:glow-blue rounded-md text-sm"
                  >
                    Search
                  </button>
                </div>
                <SuggestionList isMobile={false} />
              </div>
            )}
            
            {isAuthenticated && (
              <>
                <Link
                  to="/admin/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    isActive('/admin/dashboard')
                      ? 'text-neonBlue glow-blue bg-opacity-20'
                      : 'text-gray-300 hover:text-neonBlue'
                  }`}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-electricPurple hover:glow-purple rounded-md text-sm font-medium transition-all"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-neonBlue focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {!isAuthenticated && (
              <div className="px-3" ref={mobileSearchRef}>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={playerQuery}
                    onChange={(e) => setPlayerQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && submitPlayerSearch()}
                    placeholder="Search Player ID or Name..."
                    className="flex-1 px-3 py-2 bg-darkBg border border-neonBlue rounded-md text-sm text-white focus:outline-none focus:glow-blue"
                  />
                  <button
                    onClick={submitPlayerSearch}
                    className="px-3 py-2 bg-neonBlue hover:glow-blue rounded-md text-sm"
                  >
                    Go
                  </button>
                </div>
                <SuggestionList isMobile={true} />
              </div>
            )}

            {!isAuthenticated && publicLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.path)
                    ? 'text-neonBlue bg-opacity-20'
                    : 'text-gray-300'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <>
                <Link
                  to="/admin/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-electricPurple"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

