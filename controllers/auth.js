const User = require('../models/user');
const { hashPassword, comparePassword } = require('../utils/passwordUtils');
const { generateToken, verifyToken } = require('../utils/jwtUtils');

exports.register = async (req, res) => {
  try {
    const { name, email, password, photo, bio, phone, isPublic, isAdmin} = req.body;

    // Check if email is valid
    if (!email.includes('@')) {
      return res.status(400).json({ message: 'Please check your email address' });
    }

    // Set the user's role based on isAdmin
    const role = isAdmin ? 'admin' : 'user';

    const hashedPassword = await hashPassword(password);
    const user = new User({ name, email, password: hashedPassword, photo, bio, phone, isPublic, role });
    

    const token = generateToken({ userId: user._id, role: user.role });

    await user.save();

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

