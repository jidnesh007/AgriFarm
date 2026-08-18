const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Register Route
router.post("/register", async (req, res) => {
  try {
    console.log('📝 Register attempt:', req.body);
    
    const { name, phoneNumber, password } = req.body;

    // Validation
    if (!name || !phoneNumber || !password) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    if (!/^\d{10}$/.test(phoneNumber)) {
      return res.status(400).json({ message: "Phone number must be 10 digits" });
    }

    // Check existing user by phoneNumber
    const existingUser = await User.findOne({ phoneNumber });
    
    if (existingUser) {
      return res.status(400).json({ message: "Phone number already registered" });
    }

    // Create user using the correct model fields
    const newUser = new User({
      name,
      email: `${phoneNumber}@agrifarm.com`,
      phoneNumber,
      password
    });

    const savedUser = await newUser.save();
    console.log('✅ User registered:', savedUser._id);

    // Generate token
    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET || 'fallback-secret', {
      expiresIn: "7d",
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      userName: savedUser.name,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        phoneNumber: savedUser.phoneNumber,
      },
    });

  } catch (error) {
    console.error('❌ Registration FULL ERROR:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ message: "Phone number already registered" });
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }

    res.status(500).json({ 
      message: 'Registration failed',
      error: error.message 
    });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    if (!phoneNumber || !password) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    // Query using the correct field name from the User model
    const user = await User.findOne({ phoneNumber }).select('+password');
    
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback-secret', {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      message: "Login successful",
      token,
      userName: user.name,
      user: {
        id: user._id,
        name: user.name,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: "Server error during login" });
  }
});

module.exports = router;
