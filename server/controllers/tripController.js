const Trip = require('../models/Trip');
const Place = require('../models/Place');
const { isMongoConnected } = require('../config/db');
const { seedTrips, seedPlaces } = require('../data/seedData');

// In-memory store fallback when local MongoDB is not running
let memoryTrips = JSON.parse(JSON.stringify(seedTrips));
let memoryPlaces = JSON.parse(JSON.stringify(seedPlaces));

/**
 * Helper to compute progress & stats for a trip
 */
const computeTripStats = (trip, places) => {
  const tripPlaces = places.filter(p => p.tripId.toString() === trip._id.toString());
  const totalPlaces = tripPlaces.length;
  const completedPlaces = tripPlaces.filter(p => p.isCompleted).length;
  const progress = totalPlaces > 0 ? Math.round((completedPlaces / totalPlaces) * 100) : 0;

  const now = new Date();
  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);

  let timeframe = 'upcoming';
  if (now > end) {
    timeframe = 'completed';
  } else if (now >= start && now <= end) {
    timeframe = 'ongoing';
  }

  return {
    ...trip,
    totalPlaces,
    completedPlaces,
    progress,
    timeframe
  };
};

/**
 * @desc    Get all trips with progress metrics
 * @route   GET /api/trips
 * @access  Public
 */
const getTrips = async (req, res) => {
  try {
    const { timeframe, search } = req.query;

    if (isMongoConnected()) {
      let query = {};
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { destination: { $regex: search, $options: 'i' } }
        ];
      }

      const trips = await Trip.find(query).sort({ startDate: 1 }).lean();
      const allPlaces = await Place.find({}).lean();

      let enriched = trips.map(t => computeTripStats(t, allPlaces));

      if (timeframe && timeframe !== 'all') {
        enriched = enriched.filter(t => t.timeframe === timeframe);
      }

      return res.json(enriched);
    }

    // In-Memory Fallback
    let trips = [...memoryTrips];
    if (search) {
      const q = search.toLowerCase();
      trips = trips.filter(
        t => t.title.toLowerCase().includes(q) || t.destination.toLowerCase().includes(q)
      );
    }

    let enriched = trips.map(t => computeTripStats(t, memoryPlaces));
    enriched.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

    if (timeframe && timeframe !== 'all') {
      enriched = enriched.filter(t => t.timeframe === timeframe);
    }

    return res.json(enriched);
  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).json({ message: 'Failed to fetch trips', error: error.message });
  }
};

/**
 * @desc    Get single trip by ID with places
 * @route   GET /api/trips/:id
 * @access  Public
 */
const getTripById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoConnected()) {
      const trip = await Trip.findById(id).lean();
      if (!trip) {
        return res.status(404).json({ message: 'Trip not found' });
      }

      const places = await Place.find({ tripId: id }).sort({ createdAt: 1 }).lean();
      const enriched = computeTripStats(trip, places);
      return res.json({ ...enriched, places });
    }

    // In-Memory Fallback
    const trip = memoryTrips.find(t => t._id.toString() === id.toString());
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    const places = memoryPlaces.filter(p => p.tripId.toString() === id.toString());
    const enriched = computeTripStats(trip, places);
    return res.json({ ...enriched, places });
  } catch (error) {
    console.error('Error fetching trip details:', error);
    res.status(500).json({ message: 'Failed to fetch trip', error: error.message });
  }
};

/**
 * @desc    Create new trip
 * @route   POST /api/trips
 * @access  Public
 */
const createTrip = async (req, res) => {
  try {
    const { title, destination, startDate, endDate, coverImage } = req.body;

    if (!title || !destination || !startDate || !endDate) {
      return res.status(400).json({
        message: 'Please provide all required fields: title, destination, startDate, endDate'
      });
    }

    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({ message: 'Start date cannot be after end date' });
    }

    const defaultImage =
      coverImage && coverImage.trim() !== ''
        ? coverImage
        : 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80';

    if (isMongoConnected()) {
      const newTrip = await Trip.create({
        title,
        destination,
        startDate,
        endDate,
        coverImage: defaultImage
      });

      const enriched = computeTripStats(newTrip.toObject(), []);
      return res.status(201).json({ ...enriched, places: [] });
    }

    // In-Memory Fallback
    const newTrip = {
      _id: 'trip_' + Date.now(),
      title,
      destination,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      coverImage: defaultImage,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    memoryTrips.push(newTrip);
    const enriched = computeTripStats(newTrip, []);
    return res.status(201).json({ ...enriched, places: [] });
  } catch (error) {
    console.error('Error creating trip:', error);
    res.status(500).json({ message: 'Failed to create trip', error: error.message });
  }
};

/**
 * @desc    Update trip details
 * @route   PUT /api/trips/:id
 * @access  Public
 */
const updateTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, destination, startDate, endDate, coverImage } = req.body;

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({ message: 'Start date cannot be after end date' });
    }

    if (isMongoConnected()) {
      const updatedTrip = await Trip.findByIdAndUpdate(
        id,
        {
          ...(title && { title }),
          ...(destination && { destination }),
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
          ...(coverImage && { coverImage })
        },
        { new: true, runValidators: true }
      ).lean();

      if (!updatedTrip) {
        return res.status(404).json({ message: 'Trip not found' });
      }

      const places = await Place.find({ tripId: id }).lean();
      const enriched = computeTripStats(updatedTrip, places);
      return res.json({ ...enriched, places });
    }

    // In-Memory Fallback
    const tripIndex = memoryTrips.findIndex(t => t._id.toString() === id.toString());
    if (tripIndex === -1) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    const currentTrip = memoryTrips[tripIndex];
    const updated = {
      ...currentTrip,
      title: title !== undefined ? title : currentTrip.title,
      destination: destination !== undefined ? destination : currentTrip.destination,
      startDate: startDate ? new Date(startDate).toISOString() : currentTrip.startDate,
      endDate: endDate ? new Date(endDate).toISOString() : currentTrip.endDate,
      coverImage: coverImage !== undefined ? coverImage : currentTrip.coverImage,
      updatedAt: new Date().toISOString()
    };

    memoryTrips[tripIndex] = updated;
    const places = memoryPlaces.filter(p => p.tripId.toString() === id.toString());
    const enriched = computeTripStats(updated, places);
    return res.json({ ...enriched, places });
  } catch (error) {
    console.error('Error updating trip:', error);
    res.status(500).json({ message: 'Failed to update trip', error: error.message });
  }
};

/**
 * @desc    Delete trip and cascade delete places
 * @route   DELETE /api/trips/:id
 * @access  Public
 */
const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoConnected()) {
      const trip = await Trip.findByIdAndDelete(id);
      if (!trip) {
        return res.status(404).json({ message: 'Trip not found' });
      }
      // Cascade delete places
      await Place.deleteMany({ tripId: id });
      return res.json({ message: 'Trip and associated itinerary places deleted successfully', id });
    }

    // In-Memory Fallback
    const tripIndex = memoryTrips.findIndex(t => t._id.toString() === id.toString());
    if (tripIndex === -1) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    memoryTrips.splice(tripIndex, 1);
    memoryPlaces = memoryPlaces.filter(p => p.tripId.toString() !== id.toString());

    return res.json({ message: 'Trip and associated itinerary places deleted successfully', id });
  } catch (error) {
    console.error('Error deleting trip:', error);
    res.status(500).json({ message: 'Failed to delete trip', error: error.message });
  }
};

// Export getters/setters for placeController in-memory operations
const getMemoryPlaces = () => memoryPlaces;
const setMemoryPlaces = newPlaces => {
  memoryPlaces = newPlaces;
};
const getMemoryTrips = () => memoryTrips;

module.exports = {
  getTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  getMemoryPlaces,
  setMemoryPlaces,
  getMemoryTrips
};
