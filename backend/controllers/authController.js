const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// @desc    Register new user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  const { phoneNumber, password, role } = req.body;

  try {
    if (!phoneNumber || !password || !role) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    // Check if user exists
    const userExists = await User.findOne({ phoneNumber });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      phoneNumber,
      password: hashedPassword,
      role,
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        phoneNumber: user.phoneNumber,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  const { phoneNumber, password, role } = req.body;

  try {
    // Check for user email
    const user = await User.findOne({ phoneNumber });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Optional: Strict Role Checking
      if (role && user.role !== role) {
        return res.status(401).json({
          message: `Access denied. You are not registered as a ${role}`,
        });
      }

      res.json({
        _id: user.id,
        phoneNumber: user.phoneNumber,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { registerUser, loginUser, getUser };
