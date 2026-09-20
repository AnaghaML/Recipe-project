const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

const isMongoConnected = () => mongoose.connection.readyState === 1;

/**
 * Protect routes - Verifies JWT token and attaches authenticated owner to req.user
 */
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'restaurant_jwt_super_secret_key_2026_dev');

      if (isMongoConnected()) {
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
          return res.status(401).json({ message: 'Owner account not found. Authorization denied.' });
        }
      } else {
        // Fallback owner profile
        req.user = {
          _id: decoded.id,
          name: 'Restaurant Owner',
          email: 'owner@restaurant.com',
          role: 'owner'
        };
      }

      return next();
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      return res.status(401).json({ message: 'Token invalid or expired. Please log in again.' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'No authorization token provided. Access denied.' });
  }
};

module.exports = { protect };
