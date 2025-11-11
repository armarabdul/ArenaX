import React from 'react';
import { motion } from 'framer-motion';

const PublicAbout = () => {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-orbitron font-bold neon-blue mb-4">
            About ArenaX
          </h1>
          <p className="text-xl text-gray-400">
            Learn more about the event and organizers
          </p>
        </motion.div>

        <div className="space-y-8">
          {/* Event Description */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-darkCard border-2 border-neonBlue rounded-lg p-6"
          >
            <h2 className="text-2xl font-orbitron font-bold text-neonBlue mb-4">
              About the Event
            </h2>
            <p className="text-gray-300 leading-relaxed">
              ArenaX is an exciting multi-game competition platform designed to bring together participants
              in a series of challenging mini-games. The event combines strategy, skill, and a bit of luck
              as players compete across 10 different games to climb the leaderboard and claim victory.
            </p>
            <p className="text-gray-300 leading-relaxed mt-4">
              With a unique coin-based entry system and real-time leaderboard updates, ArenaX creates an
              engaging competitive environment where every decision matters. Whether you're a casual player
              or a competitive gamer, ArenaX offers something for everyone.
            </p>
          </motion.div>

          {/* Organizers */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-darkCard border-2 border-neonBlue rounded-lg p-6"
          >
            <h2 className="text-2xl font-orbitron font-bold text-neonBlue mb-4">
              Organizers
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-electricPurple mb-2">Faculty Coordinators</h3>
                <p className="text-gray-300">
                  [Faculty Coordinator Names]
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Contact: [Email/Phone]
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-electricPurple mb-2">Student Coordinators</h3>
                <p className="text-gray-300">
                  [Student Coordinator Names]
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Contact: [Email/Phone]
                </p>
              </div>
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-darkCard border-2 border-electricPurple rounded-lg p-6 glow-purple"
          >
            <h2 className="text-2xl font-orbitron font-bold text-electricPurple mb-4">
              Contact Us
            </h2>
            <p className="text-gray-300 mb-4">
              Have questions or need assistance? Reach out to our team!
            </p>
            <div className="space-y-2 text-gray-400">
              <p><strong className="text-neonBlue">Email:</strong> [organizer@arenax.com]</p>
              <p><strong className="text-neonBlue">Phone:</strong> [Contact Number]</p>
              <p><strong className="text-neonBlue">Location:</strong> [Event Venue]</p>
            </div>
          </motion.div>

          {/* Tech Stack */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-darkCard border-2 border-neonBlue rounded-lg p-6"
          >
            <h2 className="text-2xl font-orbitron font-bold text-neonBlue mb-4">
              Built With
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div className="text-gray-300">
                <strong className="text-neonBlue">Frontend:</strong>
                <ul className="mt-1 space-y-1 text-gray-400">
                  <li>• React.js</li>
                  <li>• Tailwind CSS</li>
                  <li>• Framer Motion</li>
                </ul>
              </div>
              <div className="text-gray-300">
                <strong className="text-neonBlue">Backend:</strong>
                <ul className="mt-1 space-y-1 text-gray-400">
                  <li>• Node.js</li>
                  <li>• Express.js</li>
                  <li>• MongoDB</li>
                </ul>
              </div>
              <div className="text-gray-300">
                <strong className="text-neonBlue">Real-time:</strong>
                <ul className="mt-1 space-y-1 text-gray-400">
                  <li>• Socket.io</li>
                  <li>• WebSocket</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PublicAbout;

