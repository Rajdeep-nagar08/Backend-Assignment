const jwt = require('jsonwebtoken');

exports.generateToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};


exports.verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
