// routes/passwordRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/model');
const path = require('path');

const router = express.Router();

// Handle Forgot Password Request
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user) {
            const resetToken = crypto.randomBytes(32).toString('hex');
            user.resetToken = resetToken;
            user.resetTokenExpires = Date.now() + 3600000; // 1 hour validity
            await user.save();

            // Construct the reset link
            const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
            res.send(`Reset your password: <a href="${resetLink}">Reset Password</a>`);
        } else {
            res.send('Email not found.');
        }
    } catch (error) {
        res.status(500).send('Error: ' + error.message);
    }
});

// Serve Reset Password Form
router.get('/reset-password/:token', async (req, res) => {
    const { token } = req.params;

    try {
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpires: { $gt: Date.now() } // Check if token is valid
        });

        if (user) {
            // Inline HTML form for reset
            res.send(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Reset Password</title>
                </head>
                <body>
                    <form action="/reset-password" method="POST">
                        <input type="hidden" name="token" value="${token}">
                        <input type="password" name="password" placeholder="Enter new password" required>
                        <button type="submit">Reset Password</button>
                    </form>
                </body>
                </html>
            `);
        } else {
            res.send('Invalid or expired token.');
        }
    } catch (error) {
        res.status(500).send('Error: ' + error.message);
    }
});

// Handle Password Reset Submission
router.post('/reset-password', async (req, res) => {
    const { token, password } = req.body;

    try {
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpires: { $gt: Date.now() } // Ensure the token is still valid
        });

        if (user) {
            const hashedPassword = bcrypt.hashSync(password, 8);
            user.password = hashedPassword;
            user.resetToken = null;  // Clear the reset token
            user.resetTokenExpires = null;  // Clear the token expiry
            await user.save();
            res.send('Password successfully reset.');
        } else {
            res.send('Invalid or expired token.');
        }
    } catch (error) {
        res.status(500).send('Error: ' + error.message);
    }
});

module.exports = router;
