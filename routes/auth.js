// routes/authRoutes.js
const express = require('express');
const { register } = require('../controllers/auth');

const router = express.Router();

// Register route
router.post('/register', register);

module.exports = router;
