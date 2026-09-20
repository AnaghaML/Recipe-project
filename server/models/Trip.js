const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Trip title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    destination: {
      type: String,
      required: [true, 'Destination (City/Country) is required'],
      trim: true,
      maxlength: [100, 'Destination cannot exceed 100 characters']
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required']
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
      trim: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual relationship to places
tripSchema.virtual('places', {
  ref: 'Place',
  localField: '_id',
  foreignField: 'tripId'
});

module.exports = mongoose.model('Trip', tripSchema);
