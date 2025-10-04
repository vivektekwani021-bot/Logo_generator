import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
// Import our new `useAuth` hook to access the context
import { useAuth } from '../../context/AuthContext';

// Animation variants (no changes here)
const containerVariants = { hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const AuthForm = ({ isRegister = false }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(''); // New state for handling errors
  
  // Get the register and login functions from our global context
  const { register, login } = useAuth();

  const { name, email, password } = formData;

  const handleChange = (e) => {
    setFormData((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors on a new submission
    try {
      if (isRegister) {
        // Use the register function from the context
        await register({ name, email, password });
      } else {
        // Use the login function from the context
        await login({ email, password });
      }
    } catch (err) {
      // If the context throws an error (e.g., wrong password), we catch it here
      // and set it to our error state to be displayed to the user.
      const errorMessage = err.response?.data?.message || 'An error occurred. Please try again.';
      setError(errorMessage);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <motion.div
        variants={containerVariants} initial="hidden" animate="visible"
        className="w-full max-w-md p-8 space-y-6 bg-white/5 backdrop-blur-sm rounded-2xl shadow-lg"
      >
        <motion.div variants={itemVariants} className="text-center">
          <h1 className="text-3xl font-bold text-white">
            {isRegister ? 'Create Your Account' : 'Welcome Back'}
          </h1>
          <p className="mt-2 text-gray-300">
            {isRegister 
              ? <>Already have an account? <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300">Log in</Link></>
              : <>Need an account? <Link to="/register" className="font-medium text-indigo-400 hover:text-indigo-300">Sign up</Link></>
            }
          </p>
        </motion.div>

        {/* This block will conditionally render the error message */}
        {error && (
          <motion.div variants={itemVariants} className="p-3 bg-red-500/20 border border-red-500/30 rounded-md text-center">
            <p className="text-sm text-red-400">{error}</p>
          </motion.div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {isRegister && (
            <motion.div variants={itemVariants}>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name</label>
              <input id="name" name="name" type="text" value={name} onChange={handleChange} required
                className="mt-1 block w-full px-3 py-2 bg-white/10 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Your Name" />
            </motion.div>
          )}

          <motion.div variants={itemVariants}>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email address</label>
            <input id="email" name="email" type="email" autoComplete="email" value={email} onChange={handleChange} required
              className="mt-1 block w-full px-3 py-2 bg-white/10 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="you@example.com" />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
            <input id="password" name="password" type="password" autoComplete="current-password" value={password} onChange={handleChange} required
              className="mt-1 block w-full px-3 py-2 bg-white/10 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••" />
          </motion.div>

          <motion.div variants={itemVariants}>
            <button type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              {isRegister ? 'Sign up' : 'Log in'}
            </button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default AuthForm;

