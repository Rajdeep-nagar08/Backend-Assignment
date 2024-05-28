const express = require('express');
const register = require('../controllers/register');
const login = require('../controllers/login');
const logout = require('../controllers/logout');
const getProfiles = require('../controllers/getProfiles');
const updateProfile = require('../controllers/updateProfile');
const updateProfileVisibility = require('../controllers/updateProfileVisibility');
const getOwnDetails = require('../controllers/getOwnDetails');
const { authenticateToken } = require('../middlewares/authMiddlewares');
// const { authorizeUser } = require('../middlewares/authorizeUser');
const { verifyGoogleToken } = require('../middlewares/verifyGoogleToken');
const passport = require('../config/passport');

const router = express.Router();

router.post('/register', register.register);
router.post('/login', login.login);
router.post('/logout', logout.logout); 
router.get('/getProfiles', authenticateToken, getProfiles.getProfiles);
router.put('/updateProfile', authenticateToken,updateProfile.updateProfile);
router.get('/getOwnDetails', authenticateToken,getOwnDetails.getOwnDetails);


// Google OAuth route
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  // Access the user details and accessToken from req.user
  const { name, email, photo, role, accessToken } = req.user;

  if (!accessToken) {
    return res.status(401).send('Access token not found. Please try logging in again.');
  }

  // Render a page displaying user details and access token
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Google OAuth User Details</title>
    </head>
    <body>
      <h1>User Details</h1>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Role:</strong> ${role}</p>
      <h2>Access Token</h2>
      <pre>${accessToken}</pre>
    </body>
    </html>
  `);

});

router.put('/updateProfileVisibility', authenticateToken,updateProfileVisibility.updateProfileVisibility);

module.exports = router;
