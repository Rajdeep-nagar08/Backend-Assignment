const express = require('express');
const { connectDB } = require('./config/database'); 
require('dotenv').config();


const app = express();

// Connect to MongoDB
connectDB();

// Additional middleware and route setup
app.use(express.json());
// Define your routes here

// Define routes
app.use('/api/auth', require('./routes/auth'));

// Default route for testing
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
