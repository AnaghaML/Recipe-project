const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderById,
  getAllOrders,
  getOrderStats,
  updateOrderStatus
} = require('../controllers/orderController');

// All routes made public (removed 'protect' middleware)
router.get('/', getAllOrders);
router.get('/stats', getOrderStats);
router.patch('/:id/status', updateOrderStatus);

// Public customer routes
router.post('/', createOrder);
router.get('/:id', getOrderById);

module.exports = router;