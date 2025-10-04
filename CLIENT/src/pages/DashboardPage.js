import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white p-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl text-center"
      >
        <div className="flex justify-end w-full mb-8">
          <button 
            onClick={logout}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Log Out
          </button>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold">
          Welcome back, <span className="text-indigo-400">{user ? user.name : 'Guest'}</span>!
        </h1>
        <p className="mt-4 text-lg text-gray-300">This is your creative dashboard. Ready to design something amazing?</p>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Your Projects</h2>
          {/* We will map over user's projects here in a future step */}
          <div className="p-10 border-2 border-dashed border-gray-700 rounded-lg">
            <p className="text-gray-400">You don't have any projects yet.</p>
            <Link to="/editor/new">
              <button className="mt-6 px-6 py-3 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors duration-300">
                Create Your First Logo
              </button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
