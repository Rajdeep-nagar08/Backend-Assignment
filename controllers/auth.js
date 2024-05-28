const User = require('../models/user');
const { hashPassword,comparePassword  } = require('../utils/passwordUtils');
const { generateToken } = require('../utils/jwtUtils');

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
  


  // Get the profile of the requesting user or all profiles based on role
// Get the profile of the requesting user or all profiles based on role
exports.getProfiles = async (req, res) => {
  try {
    const { email } = req.body;

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

  
// exports.getPublicProfiles = async (req, res) => {
//     try {
       
//         const { email } = req.body;

//         if (!email) {
//             return res.status(400).json({ message: 'Email is required' });
//           }
      
//       // Find the user based on the provided email
//       const user = await User.findOne({ email: email });
  
//       if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }
  
//       console.log(user.role)
//       // Check users role
//       if (user.role !='normal' && user.role!='admin') {
//         return res.status(403).json({ message: 'Access denied' });
//       }
  
//       // Fetch public user profiles where role is 'user'
//       const profiles = await User.find({
//         role: 'normal',
//         isPublic: true
//       }).select('-password'); // Exclude the password field from the result
  
//       res.json({ profiles });
//     } catch (error) {
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   };
  

  
// //getAllProfiles
// exports.getPrivateProfiles = async (req, res) => {
//     try {
//         const { email } = req.body;

//         if (!email) {
//             return res.status(400).json({ message: 'Email is required' });
//           }
  
//       // Find the user based on the provided email
//       const user = await User.findOne({ email: email });
  
//       if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }
  
//       // Check if the user's role is 'admin'
//       if (user.role !== 'admin') {
//         return res.status(403).json({ message: 'Access denied' });
//       }
  
//       // If the user is an admin, fetch all user profiles
//       const profiles = await User.find({}).select('-password'); // Exclude the password field from the result
  
//       res.json({ profiles });
//     } catch (error) {
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   };
  

