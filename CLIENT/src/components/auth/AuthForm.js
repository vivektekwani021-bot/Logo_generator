import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../api/authService'; // We import our new service

// Animation variants for the form container and its items
const containerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const AuthForm = ({ isRegister = false }) => {
  // State to manage the input fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { name, email, password } = formData;
  const navigate = useNavigate();

  // Function to update state when user types
  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRegister) {
      try {
        const userData = { name, email, password };
        const user = await authService.register(userData);
        console.log('Registration successful:', user);
        // On success, redirect the user to their dashboard
        navigate('/dashboard');
      } catch (error) {
        console.error('Registration failed:', error.response ? error.response.data : error.message);
        // In a real app, you would set an error state here to show a message
      }
    } else {
      // Login logic will be added here later
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
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

        {/* Attach the submit handler to the form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {isRegister && (
            <motion.div variants={itemVariants}>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 bg-white/10 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Your Name"
              />
            </motion.div>
          )}

          <motion.div variants={itemVariants}>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-white/10 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="you@example.com"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-white/10 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isRegister ? 'Sign up' : 'Log in'}
            </button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default AuthForm;

