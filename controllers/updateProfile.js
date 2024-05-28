
const User = require('../models/user');
const { hashPassword,comparePassword  } = require('../utils/passwordUtils');

/**
 * @swagger
 * /api/auth/updateProfile:
 *   put:
 *     summary: Update User Profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's updated name
 *                 example: John Doe
 *               photo:
 *                 type: string
 *                 description: URL to user's updated profile photo
 *                 example: https://example.com/new_profile.jpg
 *               bio:
 *                 type: string
 *                 description: User's updated biography
 *                 example: Passionate developer with a focus on backend development
 *               phone:
 *                 type: string
 *                 description: User's updated phone number
 *                 example: +1234567890
 *               email:
 *                 type: string
 *                 description: User's updated email address
 *                 example: newuser@example.com
 *               currentPassword:
 *                 type: string
 *                 description: User's current password (required if changing password)
 *                 example: oldPassword123
 *               newPassword:
 *                 type: string
 *                 description: User's new password (required if changing password)
 *                 example: newPassword456
 *               confirmPassword:
 *                 type: string
 *                 description: Confirm user's new password (required if changing password)
 *                 example: newPassword456
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: User Details Updated Successfully!
 *       400:
 *         description: Bad request (invalid email format, mismatched passwords, unauthorized)
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
 *         description: Unauthorized (current password incorrect)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: Current password is incorrect
 */


exports.updateProfile = async (req, res) => {
    try {
      const { name, photo, bio, phone, email, currentPassword, newPassword, confirmPassword } = req.body;
  
      // Check if email is valid
      if (!email.includes('@')) {
        return res.status(400).json({ message: 'Invalid email address' });
      }
  
      const user = await User.findById(req.user.id);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update profile information
      user.name = name || user.name;
      user.photo = photo || user.photo;
      user.bio = bio || user.bio;
      user.phone = phone || user.phone;
      user.email = email || user.email;
  
      // Change password if provided
      if (currentPassword && newPassword && confirmPassword) {
        //if the current password matches the stored password
        const isMatch = await comparePassword(currentPassword, user.password);
        if (!isMatch) {
          return res.status(401).json({ message: 'Current password is incorrect as stored in Database' });
        }
  
        //if the new password and confirm password match
        if (newPassword !== confirmPassword) {
          return res.status(400).json({ message: 'New password and confirm password do not match' });
        }
        //if the newPassword matches with oldPassword
        if (newPassword == currentPassword) {
          return res.status(400).json({ message: 'New password cannot be the old password. Please choose a new Password' });
        }
  
        // Hash the new password and update the user's password
        user.password = await hashPassword(newPassword);
      }
      const message = "User Details Updated Successfully!"
  
      await user.save();
      res.json(message);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  