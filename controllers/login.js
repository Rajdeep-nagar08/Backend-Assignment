
const User = require('../models/user');
const { comparePassword  } = require('../utils/passwordUtils');
const { generateToken } = require('../utils/jwtUtils');

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: User's password
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: User logged in successfully
 *                 token:
 *                   type: string
 *                   description: JWT access token
 *       400:
 *         description: Bad request (invalid email format or error message)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: Invalid email address or error.message
 *       401:
 *         description: Unauthorized (invalid email or password)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: Invalid email or password
 */


exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if email is valid
      if (!email.includes('@')) {
        return res.status(400).json({ message: 'Invalid email address' });
      }
  
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      // Compare passwords
      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

  
      // Generate JWT token
      const token = generateToken({ userId: user._id, role: user.role });
      const message = 'User logged in successfully';
  
      // Return user details along with the token and message
      res.json({ message, token });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  