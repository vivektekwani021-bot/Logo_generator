const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
} = require('../CONTROLLERS/userController');

// Defines the routes and connects them to the controller functions
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;

