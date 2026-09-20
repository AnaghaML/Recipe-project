const Place = require('../models/Place');
const Trip = require('../models/Trip');
const { isMongoConnected } = require('../config/db');
const {
  getMemoryPlaces,
  setMemoryPlaces,
  getMemoryTrips
} = require('./tripController');

/**
 * @desc    Get all places for a specific trip (with optional category & status filter)
 * @route   GET /api/trips/:tripId/places
 * @access  Public
 */
const getPlacesForTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { category, status } = req.query;

    if (isMongoConnected()) {
      let query = { tripId };

      if (category && category !== 'All') {
        query.category = category;
      }

      if (status === 'completed') {
        query.isCompleted = true;
      } else if (status === 'pending') {
        query.isCompleted = false;
      }

      const places = await Place.find(query).sort({ createdAt: 1 });
      return res.json(places);
    }

    // In-Memory Fallback
    let places = getMemoryPlaces().filter(p => p.tripId.toString() === tripId.toString());

    if (category && category !== 'All') {
      places = places.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (status === 'completed') {
      places = places.filter(p => p.isCompleted === true);
    } else if (status === 'pending') {
      places = places.filter(p => p.isCompleted === false);
    }

    return res.json(places);
  } catch (error) {
    console.error('Error fetching places:', error);
    res.status(500).json({ message: 'Failed to fetch places', error: error.message });
  }
};

/**
 * @desc    Add a new place to a trip
 * @route   POST /api/trips/:tripId/places
 * @access  Public
 */
const addPlace = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { name, category, notes, isCompleted } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Place name is required' });
    }

    const validCategories = ['Sightseeing', 'Food', 'Hotel', 'Activity', 'Transport', 'Other'];
    const selectedCategory = validCategories.includes(category) ? category : 'Sightseeing';

    if (isMongoConnected()) {
      const tripExists = await Trip.findById(tripId);
      if (!tripExists) {
        return res.status(404).json({ message: 'Trip not found' });
      }

      const newPlace = await Place.create({
        tripId,
        name: name.trim(),
        category: selectedCategory,
        notes: notes ? notes.trim() : '',
        isCompleted: Boolean(isCompleted)
      });

      return res.status(201).json(newPlace);
    }

    // In-Memory Fallback
    const tripExists = getMemoryTrips().some(t => t._id.toString() === tripId.toString());
    if (!tripExists) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    const newPlace = {
      _id: 'place_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      tripId,
      name: name.trim(),
      category: selectedCategory,
      notes: notes ? notes.trim() : '',
      isCompleted: Boolean(isCompleted),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const currentPlaces = getMemoryPlaces();
    setMemoryPlaces([...currentPlaces, newPlace]);

    return res.status(201).json(newPlace);
  } catch (error) {
    console.error('Error adding place:', error);
    res.status(500).json({ message: 'Failed to add place', error: error.message });
  }
};

/**
 * @desc    Update a place
 * @route   PUT /api/places/:id
 * @access  Public
 */
const updatePlace = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, notes, isCompleted } = req.body;

    if (isMongoConnected()) {
      const updatedPlace = await Place.findByIdAndUpdate(
        id,
        {
          ...(name && { name: name.trim() }),
          ...(category && { category }),
          ...(notes !== undefined && { notes: notes.trim() }),
          ...(isCompleted !== undefined && { isCompleted: Boolean(isCompleted) })
        },
        { new: true, runValidators: true }
      );

      if (!updatedPlace) {
        return res.status(404).json({ message: 'Place not found' });
      }

      return res.json(updatedPlace);
    }

    // In-Memory Fallback
    const places = getMemoryPlaces();
    const index = places.findIndex(p => p._id.toString() === id.toString());

    if (index === -1) {
      return res.status(404).json({ message: 'Place not found' });
    }

    const current = places[index];
    const updated = {
      ...current,
      name: name !== undefined ? name.trim() : current.name,
      category: category !== undefined ? category : current.category,
      notes: notes !== undefined ? notes.trim() : current.notes,
      isCompleted: isCompleted !== undefined ? Boolean(isCompleted) : current.isCompleted,
      updatedAt: new Date().toISOString()
    };

    places[index] = updated;
    setMemoryPlaces([...places]);

    return res.json(updated);
  } catch (error) {
    console.error('Error updating place:', error);
    res.status(500).json({ message: 'Failed to update place', error: error.message });
  }
};

/**
 * @desc    Toggle place completion status (Mark as Done / Mark as Pending)
 * @route   PATCH /api/places/:id/toggle
 * @access  Public
 */
const togglePlaceStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoConnected()) {
      const place = await Place.findById(id);
      if (!place) {
        return res.status(404).json({ message: 'Place not found' });
      }

      place.isCompleted = !place.isCompleted;
      await place.save();
      return res.json(place);
    }

    // In-Memory Fallback
    const places = getMemoryPlaces();
    const index = places.findIndex(p => p._id.toString() === id.toString());

    if (index === -1) {
      return res.status(404).json({ message: 'Place not found' });
    }

    places[index].isCompleted = !places[index].isCompleted;
    places[index].updatedAt = new Date().toISOString();
    setMemoryPlaces([...places]);

    return res.json(places[index]);
  } catch (error) {
    console.error('Error toggling place status:', error);
    res.status(500).json({ message: 'Failed to toggle place status', error: error.message });
  }
};

/**
 * @desc    Delete a place
 * @route   DELETE /api/places/:id
 * @access  Public
 */
const deletePlace = async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoConnected()) {
      const deletedPlace = await Place.findByIdAndDelete(id);
      if (!deletedPlace) {
        return res.status(404).json({ message: 'Place not found' });
      }
      return res.json({ message: 'Place deleted successfully', id });
    }

    // In-Memory Fallback
    const places = getMemoryPlaces();
    const index = places.findIndex(p => p._id.toString() === id.toString());

    if (index === -1) {
      return res.status(404).json({ message: 'Place not found' });
    }

    places.splice(index, 1);
    setMemoryPlaces([...places]);

    return res.json({ message: 'Place deleted successfully', id });
  } catch (error) {
    console.error('Error deleting place:', error);
    res.status(500).json({ message: 'Failed to delete place', error: error.message });
  }
};

module.exports = {
  getPlacesForTrip,
  addPlace,
  updatePlace,
  togglePlaceStatus,
  deletePlace
};
