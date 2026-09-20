const express = require('express');
const router = express.Router();
const {
  getTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip
} = require('../controllers/tripController');
const {
  getPlacesForTrip,
  addPlace
} = require('../controllers/placeController');

// Trip CRUD routes
router.route('/')
  .get(getTrips)
  .post(createTrip);

router.route('/:id')
  .get(getTripById)
  .put(updateTrip)
  .delete(deleteTrip);

// Sub-resource routes for Trip Places
router.route('/:tripId/places')
  .get(getPlacesForTrip)
  .post(addPlace);

module.exports = router;
