import axios from 'axios';

// Define the base URL for our backend API
const API_URL = 'http://localhost:4000/api/users/';

// Register user
const register = async (userData) => {
  const response = await axios.post(API_URL + 'register', userData);
  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData);
  return response.data;
};

const authService = {
  register,
  login,
};

export default authService;



