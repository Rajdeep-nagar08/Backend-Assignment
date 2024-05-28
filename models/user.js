const mongoose = require('mongoose');

// user schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: function () {
      return !this.googleId; // Make password required if googleId is not present
    }
  },
  photo: { type: String },
  bio: { type: String },
  phone: { type: String },
  isPublic: { type: Boolean, default: true },
  role: { type: String, enum: ['normal', 'admin'], default: 'normal' },
  googleId: { type: String },
  facebookId: { type: String },
  twitterId: { type: String },
  githubId: { type: String }
});

module.exports = mongoose.model('User', userSchema);
