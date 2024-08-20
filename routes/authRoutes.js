const express = require('express');
const router = express.Router();
const User = require('../models/model');

// Sign-up route
router.post('/sign-up', async (req, res) => {
  try {
    const newUser = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: req.body.password,
      country: req.body.country
    });

    await newUser.save();
    res.redirect('login.html');
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ message: 'Error saving user', error: error.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user && req.body.password === user.password) {
      res.cookie('userId', user._id.toString(), { httpOnly: true });
      res.redirect('/profile'); // Redirect to profile page
    } else {
      res.status(400).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// Logout route
router.get('/logout', (req, res) => {
  res.clearCookie('userId');
  res.redirect('home.html');
});

module.exports = router;
