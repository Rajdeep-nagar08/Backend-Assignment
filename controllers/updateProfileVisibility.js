
const User = require('../models/user');

/**
 * @swagger
 * /api/auth/updateProfileVisibility:
 *   put:
 *     summary: Update Profile Visibility
 *     security:
 *       - bearerAuth: []
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
 *         description: Profile visibility updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: Profile visibility updated successfully
 *                 isPublic:
 *                   type: boolean
 *                   description: Updated visibility status
 *                   example: true
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
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: User not found
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



exports.updateProfileVisibility = async (req, res) => {
    try {
      const { email } = req.body;
  
      // Check if email is valid
      if (!email.includes('@')) {
        return res.status(400).json({ message: 'Invalid email address' });
      }
  
      // Find the user by email
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update the isPublic field
      if(user.isPublic==true){
        user.isPublic=false;
      }
      else
      user.isPublic=true;

      await user.save();
  
      res.json({ message: 'Profile visibility updated successfully', isPublic: user.isPublic });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };