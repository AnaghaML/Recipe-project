const express = require('express');
const router = express.Router();
const {
  updatePlace,
  togglePlaceStatus,
  deletePlace
} = require('../controllers/placeController');

// Direct place updates, completion toggling, and deletion
router.route('/:id')
  .put(updatePlace)
  .delete(deletePlace);

router.route('/:id/toggle')
  .patch(togglePlaceStatus);

module.exports = router;
