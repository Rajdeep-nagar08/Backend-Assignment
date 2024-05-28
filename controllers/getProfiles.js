
const User = require('../models/user');

// Get the profile of the requesting user or all profiles based on role


/**
 * @swagger
 * /api/auth/getProfiles:
 *   get:
 *     summary: Get Profiles
 *     description: Retrieve profiles of users based on the requester's role.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: Email of the requesting user
 *     responses:
 *       200:
 *         description: Profiles fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: Profiles fetched successfully
 *                 users:
 *                   type: array
 *                   description: List of user profiles
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: User ID
 *                         example: 60bcdf2ae2c67b001c34a5c1
 *                       name:
 *                         type: string
 *                         description: User's name
 *                         example: John Doe
 *                       email:
 *                         type: string
 *                         description: User's email address
 *                         example: user@example.com
 *                       photo:
 *                         type: string
 *                         description: URL of user's profile photo
 *                         example: https://example.com/profile.jpg
 *                       bio:
 *                         type: string
 *                         description: User's biography
 *                         example: Software Developer
 *                       phone:
 *                         type: string
 *                         description: User's phone number
 *                         example: +1234567890
 *                       isPublic:
 *                         type: boolean
 *                         description: Indicates if user's profile is public
 *                         example: true
 *       400:
 *         description: Bad request (invalid email format)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: Invalid email address
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
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: Internal server error
 */




exports.getProfiles = async (req, res) => {
    try {
      const { email } = req.query;
  
      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }
  
      // Check if email is valid
      if (!email.includes('@')) {
        return res.status(400).json({ message: 'Invalid email address' });
      }
  
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      let users;
  
      if (user.role === 'admin') {
        // Fetch all user profiles if the requester is an admin
        users = await User.find({ _id: { $ne: user._id } }); // Exclude the requesting user
      } else {
        // Fetch only public profiles for normal users
        users = await User.find({ isPublic: true, _id: { $ne: user._id } }); // Exclude the requesting user
      }
  
      const usersWithoutPasswords = users.map(user => {
        const { password, ...userWithoutPassword } = user.toObject();
        return userWithoutPassword;
      });
  
      res.json({ message: 'Profiles fetched successfully', users: usersWithoutPasswords });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };