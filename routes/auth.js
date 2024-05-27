// routes/authRoutes.js
const express = require('express');
const auth = require('../controllers/auth');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', auth.register);
router.post('/login', auth.login);
router.post('/logout', authenticateToken, auth.logout); 
router.get('/profile', authenticateToken, auth.getProfile);
router.put('/updateProfile', authenticateToken, auth.updateProfile);
router.get('/getPublicProfiles', authenticateToken,auth.getPublicProfiles);
router.get('/getPrivateProfiles', authenticateToken,auth.getPrivateProfiles);


module.exports = router;
