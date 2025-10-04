import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../api/authService'; // Corrected import path
import { useNavigate } from 'react-router-dom';

// Create the context
const AuthContext = createContext(null);

// Create a custom hook to use the context easily
export const useAuth = () => {
  return useContext(AuthContext);
};

// Create the Provider component that will wrap our application
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // On initial app load, check if user data exists in localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Login function
  const login = async (userData) => {
    try {
      const response = await authService.login(userData);
      localStorage.setItem('user', JSON.stringify(response)); // Save session
      setUser(response);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed in context:', error);
      throw error; // Re-throw error to be handled by the form
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      await authService.register(userData);
      navigate('/login'); // Redirect to login after successful registration
    } catch (error) {
      console.error('Registration failed in context:', error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user'); // Clear session
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

