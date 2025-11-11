import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const PublicHome = () => {
  const [logoError, setLogoError] = useState(false);
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-neonBlue opacity-10 blur-3xl"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4"
          >
            {logoError ? (
              <h1 className="text-6xl md:text-8xl font-orbitron font-bold neon-blue">
                ARENAX
              </h1>
            ) : (
              <img 
                src="/logo.png" 
                alt="ARXENA Logo" 
                className="h-64 md:h-96 lg:h-[28rem] xl:h-[36rem] w-auto mx-auto object-contain"
                onError={() => setLogoError(true)}
              />
            )}
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-2xl md:text-3xl font-bebas text-electricPurple mb-8"
          >
            Play. Compete. Conquer.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            Join the ultimate multi-game competition! Test your skills across 10 exciting mini-games,
            compete for the top spot, and prove you're the champion.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link
              to="/leaderboard"
              className="px-8 py-3 bg-neonBlue hover:glow-blue rounded-md font-medium transition-all text-lg"
            >
              View Leaderboard
            </Link>
            <Link
              to="/games"
              className="px-8 py-3 bg-electricPurple hover:glow-purple rounded-md font-medium transition-all text-lg"
            >
              Explore Games
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-orbitron font-bold text-center text-neonBlue mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-darkCard border-2 border-neonBlue rounded-lg p-6 text-center"
            >
              <div className="text-4xl mb-4">🎮</div>
              <h3 className="text-xl font-orbitron font-bold text-neonBlue mb-2">10 Mini-Games</h3>
              <p className="text-gray-400">
                Compete across 10 exciting games, each with unique challenges and point values.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-darkCard border-2 border-neonBlue rounded-lg p-6 text-center"
            >
              <div className="text-4xl mb-4">🪙</div>
              <h3 className="text-xl font-orbitron font-bold text-neonBlue mb-2">Coin System</h3>
              <p className="text-gray-400">
                Start with 10 coins. Use them to enter games. Win to get points and coin refunds!
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-darkCard border-2 border-neonBlue rounded-lg p-6 text-center"
            >
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-orbitron font-bold text-neonBlue mb-2">Live Leaderboard</h3>
              <p className="text-gray-400">
                Watch your rank change in real-time as you compete for the top position.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-darkCard border-2 border-electricPurple rounded-lg p-8 glow-purple"
          >
            <h2 className="text-3xl font-orbitron font-bold text-electricPurple mb-4">
              Ready to Compete?
            </h2>
            <p className="text-gray-300 mb-6">
              Check out the rules, explore the games, and see who's leading the competition!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/rules"
                className="px-6 py-2 bg-neonBlue hover:glow-blue rounded-md font-medium transition-all"
              >
                Read Rules
              </Link>
              <Link
                to="/about"
                className="px-6 py-2 bg-electricPurple hover:glow-purple rounded-md font-medium transition-all"
              >
                About Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PublicHome;

