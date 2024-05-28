// routes/authRoutes.js
const express = require('express');
const auth = require('../controllers/auth');
const { authenticateToken } = require('../middlewares/auth');
const passport = require('../config/passport');

const router = express.Router();

router.post('/register', auth.register);
router.post('/login', auth.login);
router.post('/logout', authenticateToken, auth.logout); 
router.get('/getProfiles', authenticateToken, auth.getProfiles);
router.put('/updateProfile', authenticateToken, auth.updateProfile);
// router.get('/getPublicProfiles', authenticateToken,auth.getPublicProfiles);
// router.get('/getPrivateProfiles', authenticateToken,auth.getPrivateProfiles);



// Google OAuth route
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  // Redirect to home page after successful authentication
  res.redirect('https://voosh.ai/');
});

router.put('/updateProfileVisibility', authenticateToken, auth.updateProfileVisibility);

module.exports = router;
