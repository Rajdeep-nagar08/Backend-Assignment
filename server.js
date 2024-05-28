// server.js
const express = require('express');
const { connectDB } = require('./config/database'); 
require('dotenv').config();
const passport = require('./config/passport'); 
const session = require('express-session');
const authRoutes = require('./routes/routes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const app = express();

// Connect to MongoDB
connectDB();

// Middleware to parse request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Express session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set secure: true if using https
}));

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

// Define routes
app.use('/auth', require('./routes/routes'));

// Define your API routes here
app.use('/api', authRoutes);

app.use('/api/auth', authRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Default route for testing
app.get('/', (req, res) => {
  res.send('API is running...');
});



// Error handling middleware
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
