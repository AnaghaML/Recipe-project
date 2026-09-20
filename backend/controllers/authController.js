const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const isMongoConnected = () => mongoose.connection.readyState === 1;

// Helper to generate signed JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'restaurant_jwt_super_secret_key_2026_dev', {
    expiresIn: '7d'
  });
};

/**
 * @desc    Register a new Owner / Admin
 * @route   POST /api/auth/register
 * @access  Public (for initial setup)
 */
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    if (isMongoConnected()) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ message: 'An account with this email already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'owner'
      });

      return res.status(201).json({
        message: 'Owner account registered successfully',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token: generateToken(user._id)
      });
    }

    // Resilient fallback
    return res.status(201).json({
      message: 'Owner account registered successfully (Demo mode)',
      user: {
        _id: 'owner-default-id',
        name,
        email: email.toLowerCase(),
        role: 'owner'
      },
      token: generateToken('owner-default-id')
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

/**
 * @desc    Owner Login & token generation
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter both email and password' });
    }

    if (isMongoConnected()) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      return res.json({
        message: 'Login successful',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token: generateToken(user._id)
      });
    }

    // Resilient fallback authentication:
    // Default Owner credentials: owner@restaurant.com / password123
    if (email.toLowerCase() === 'owner@restaurant.com' && password === 'password123') {
      return res.json({
        message: 'Login successful (Default Owner)',
        user: {
          _id: 'owner-default-id',
          name: 'Restaurant Owner',
          email: 'owner@restaurant.com',
          role: 'owner'
        },
        token: generateToken('owner-default-id')
      });
    }

    return res.status(401).json({ message: 'Invalid email or password. Hint: owner@restaurant.com / password123' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

/**
 * @desc    Get currently authenticated owner profile
 * @route   GET /api/auth/me
 * @access  Protected
 */
const getMe = async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve profile', error: error.message });
  }
};

module.exports = { register, login, getMe };
