const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors'); // 1. Import the cors package

// Import routes
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// 2. Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// A simple test route to make sure the server is working
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Use the routes
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

