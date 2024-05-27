const express = require('express');
const { connectDB } = require('./config/database'); 

const app = express();

// Connect to MongoDB
connectDB();

// Additional middleware and route setup
app.use(express.json());
// Define your routes here

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
