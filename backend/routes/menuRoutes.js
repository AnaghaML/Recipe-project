const express = require('express');
const router = express.Router();
const {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} = require('../controllers/menuController');
const { protect } = require('../middleware/authMiddleware');

// Public routes for customers
router.get('/', getMenuItems);
router.get('/:id', getMenuItemById);

// Protected routes for restaurant owner
router.post('/', protect, createMenuItem);
router.put('/:id', protect, updateMenuItem);
router.delete('/:id', protect, deleteMenuItem);

module.exports = router;
