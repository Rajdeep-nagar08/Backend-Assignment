const User = require('../models/user');
const { hashPassword} = require('../utils/passwordUtils');
const { generateToken } = require('../utils/jwtUtils');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's name
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 description: User's email address
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: User's password
 *                 example: secret123
 *               photo:
 *                 type: string
 *                 description: URL to user's profile photo
 *                 example: https://example.com/profile.jpg
 *               bio:
 *                 type: string
 *                 description: User's biography
 *                 example: Passionate developer
 *               phone:
 *                 type: string
 *                 description: User's phone number
 *                 example: +1234567890
 *               isPublic:
 *                 type: boolean
 *                 description: Whether the user's profile is public
 *                 example: true
 *               isAdmin:
 *                 type: boolean
 *                 description: Whether the user is an admin
 *                 example: false
 *     responses:
 *       201:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: User registered successfully
 *                 token:
 *                   type: string
 *                   description: JWT access token
 *       400:
 *         description: Bad request (invalid email format, existing user, or password complexity)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: Invalid email address or error.message
 */

exports.register = async (req, res) => {
  try {
    const { name, email, password, photo, bio, phone, isPublic, isAdmin } = req.body;

    // Check if email is valid
    if (!email.includes('@')) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    // Check if user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Check password complexity
    if (!isStrongPassword(password)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character' });
    }

    // Set the user's role based on isAdmin
    const role = isAdmin ? 'admin' : 'normal';

    const hashedPassword = await hashPassword(password);
    const user = new User({ name, email, password: hashedPassword, photo, bio, phone, isPublic, role });

    const token = generateToken({ userId: user._id, role: user.role });

    await user.save();

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


function isStrongPassword(password) {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{":;'?/>.<,])(?=.*\w).{8,}$/;
    return passwordRegex.test(password);
  }
  