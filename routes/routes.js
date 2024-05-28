const express = require('express');
const register = require('../controllers/register');
const login = require('../controllers/login');
const logout = require('../controllers/logout');
const getProfiles = require('../controllers/getProfiles');
const updateProfile = require('../controllers/updateProfile');
const updateProfileVisibility = require('../controllers/updateProfileVisibility');
const getOwnDetails = require('../controllers/getOwnDetails');
const { authenticateToken } = require('../middlewares/authMiddlewares');
const passport = require('../config/passport');

const router = express.Router();

router.post('/register', register.register);
router.post('/login', login.login);
router.post('/logout', logout.logout); 
router.get('/getProfiles', authenticateToken, getProfiles.getProfiles);
router.put('/updateProfile', authenticateToken, updateProfile.updateProfile);
router.get('/getOwnDetails', authenticateToken, getOwnDetails.getOwnDetails);


// Google OAuth route
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  // Redirect to home page after successful authentication
  res.redirect('https://voosh.ai/');
});

router.put('/updateProfileVisibility', authenticateToken, updateProfileVisibility.updateProfileVisibility);

module.exports = router;
