
const User = require('../models/user');
const swagger = require('../swagger');
const { generateToken } = require('../utils/jwtUtils');

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout User
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
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: User logged out successfully
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
 *         description: Unauthorized (user not found)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: User not found
 */


exports.logout = async (req, res) => {
    try {
      const { email } = req.body;

      // Check if email is provided
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }
  
      // Check if email is valid
      if (!email.includes('@')) {
        return res.status(400).json({ message: 'Invalid email address' });
      }
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
      const token = generateToken({ userId: user._id, role: user.role });
      // clear the JWT token from the client-side means remove from localStorage
      res.json({ message: 'User logged out successfully' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  