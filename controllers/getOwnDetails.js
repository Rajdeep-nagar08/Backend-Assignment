const User = require('../models/user');

/**
 * @swagger
 * /api/auth/getOwnProfile/{email}:
 *   get:
 *     summary: Get Own Profile
 *     description: Retrieve the profile of the authenticated user using email as parameter.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Email of the authenticated user
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized (user not authenticated)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *                   description: Error message
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                   description: Error message
 */

exports.getOwnDetails = async (req, res) => {
  try {
    // Extract the authenticated user's email from the URL parameter
    const { email } = req.query;

    // Find the user by email
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Prepare the response object excluding sensitive information like passwords
    const userWithoutPassword = {
      _id: user._id,
      name: user.name,
      email: user.email,
      photo: user.photo,
      bio: user.bio,
      phone: user.phone,
      isPublic: user.isPublic,
      role: user.role,
    };

    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
