const mongoose = require('mongoose');

/**
 * MenuItem Schema
 * Represents dishes and beverages served by the restaurant.
 * Fields: name, description, price, category, image, available
 */
const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a dish name'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please provide a dish description'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price in INR'],
      min: [0, 'Price must be a positive number']
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: {
        values: ['Starters', 'Main Course', 'Desserts', 'Drinks'],
        message: '{VALUE} is not a valid category'
      },
      trim: true
    },
    image: {
      type: String,
      required: [true, 'Please provide an image URL'],
      trim: true
    },
    available: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model('MenuItem', menuItemSchema);