import axios from 'axios';

// The base URL of our backend API
const API_URL = 'http://localhost:4000/api/users/';

// Register user function
const register = async (userData) => {
  const response = await axios.post(API_URL + 'register', userData);

  if (response.data) {
    // We can store the user data (including the token) in localStorage for now
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

const authService = {
  register,
};

export default authService;
