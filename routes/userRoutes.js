const express = require('express');
const router = express.Router();
const User = require('../models/model');
const mongoose = require('mongoose');

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Serve profile page
router.get('/profile', async (req, res) => {
  try {
    const userId = req.cookies.userId;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid User ID format' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send JSON data about the user
    res.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
});

// Update profile route
router.put('/update-profile', async (req, res) => {
  try {
    const { firstname, lastname, email, password, country } = req.body;
    const userId = req.cookies.userId;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid User ID format' });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, { firstname, lastname, email, password, country }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
});

// Change password route
router.post('/change-password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.cookies.userId;

    // Validate new password
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message: 'New password must be at least 8 characters long, include at least 1 letter, 1 number, and 1 special character.'
      });
    }

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid User ID format' });
    }

    const user = await User.findById(userId);
    if (!user || user.password !== currentPassword) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;

    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Error updating password', error: error.message });
  }
});

module.exports = router;
