const mongoose = require('mongoose');

/**
 * User / Owner Schema
 * Represents the restaurant owner or admin who can manage menu items and view/update orders.
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide an owner name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6
    },
    role: {
      type: String,
      enum: ['owner', 'admin'],
      default: 'owner'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);
