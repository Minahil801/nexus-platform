const express = require('express');
const nodemailer = require('nodemailer');
const OTP = require('../models/OTP');
const User = require('../models/User');

const router = express.Router();

// Mock email transporter (console log only)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'mock@example.com', // Mock email
    pass: 'mockpassword'
  }
});

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate OTP
    const otp = generateOTP();

    // Delete old OTPs for this email
    await OTP.deleteMany({ email });

    // Save new OTP
    const otpDoc = new OTP({ email, otp });
    await otpDoc.save();

    // Mock: Log OTP to console instead of sending email
    console.log(`📧 Mock OTP Email sent to ${email}: ${otp}`);

    res.json({
      message: 'OTP sent successfully (check console for mock OTP)',
      mockOTP: otp // Only for development/testing
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find OTP
    const otpDoc = await OTP.findOne({ email, otp });

    if (!otpDoc) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Delete OTP after verification
    await OTP.deleteOne({ _id: otpDoc._id });

    res.json({
      message: 'OTP verified successfully',
      verified: true
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;