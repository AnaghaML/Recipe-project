const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema(
  {
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: [true, 'Trip ID is required']
    },
    name: {
      type: String,
      required: [true, 'Place name is required'],
      trim: true,
      maxlength: [120, 'Place name cannot exceed 120 characters']
    },
    category: {
      type: String,
      required: true,
      enum: {
        values: ['Sightseeing', 'Food', 'Hotel', 'Activity', 'Transport', 'Other'],
        message: '{VALUE} is not a supported category'
      },
      default: 'Sightseeing'
    },
    notes: {
      type: String,
      trim: true,
      default: ''
    },
    isCompleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Place', placeSchema);
