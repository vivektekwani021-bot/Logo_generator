import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Animation variants for Framer Motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

const HomePage = () => {
  return (
    <div className="flex items-center justify-center h-screen text-center px-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl font-extrabold text-white tracking-tight"
        >
          Design Your Vision
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-300"
        >
          Unleash your creativity with a powerful, intuitive, and free logo
          creation platform. Build your brand's identity in minutes.
        </motion.p>
        
        <motion.div variants={itemVariants} className="mt-10 flex justify-center gap-x-6">
          <Link
            to="/register"
            className="rounded-md bg-indigo-500 px-4 py-3 text-lg font-semibold text-white shadow-lg hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 transition-colors duration-300"
          >
            Get started for free
          </Link>
          <Link
            to="/login"
            className="rounded-md px-4 py-3 text-lg font-semibold leading-6 text-white hover:bg-white/10 transition-colors duration-300"
          >
            Log In <span aria-hidden="true">→</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HomePage;

