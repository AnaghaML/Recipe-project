const mongoose = require('mongoose');
const Order = require('../models/Order');

// Fallback in-memory order store
let memoryOrders = [
  {
    _id: "ORD-9102",
    customerName: "Aarav Sharma",
    customerPhone: "+91 98765 43210",
    customerEmail: "aarav.sharma@example.com",
    items: [
      { name: "Paneer Butter Masala Royal Combo", price: 360, quantity: 2 },
      { name: "Crispy Paneer Tikka", price: 260, quantity: 1 }
    ],
    totalAmount: 980,
    status: "Preparing",
    orderNotes: "Please make the gravy medium spicy.",
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString()
  },
  {
    _id: "ORD-8421",
    customerName: "Sneha Patel",
    customerPhone: "+91 98123 45678",
    customerEmail: "sneha.p@example.com",
    items: [
      { name: "Wood-Fired Margherita Pizza", price: 420, quantity: 1 },
      { name: "Classic Virgin Mojito", price: 160, quantity: 2 }
    ],
    totalAmount: 740,
    status: "Pending",
    orderNotes: "Extra lime in mojitos please!",
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString()
  },
  {
    _id: "ORD-7319",
    customerName: "Rohan Verma",
    customerPhone: "+91 97654 32109",
    customerEmail: "rohan.v@example.com",
    items: [
      { name: "Creamy Truffle Penne Alfredo", price: 380, quantity: 1 },
      { name: "Death By Chocolate Sizzler", price: 250, quantity: 1 }
    ],
    totalAmount: 630,
    status: "Completed",
    orderNotes: "",
    createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString()
  }
];

const isMongoConnected = () => mongoose.connection.readyState === 1;

/**
 * @desc    Place a new customer order
 * @route   POST /api/orders
 * @access  Public
 */
const createOrder = async (req, res) => {
  try {
    const { customerName, customerPhone, customerEmail, items, totalAmount, orderNotes } = req.body;

    if (!customerName || !customerPhone || !customerEmail) {
      return res.status(400).json({ message: 'Please provide all customer details (name, phone, email)' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    if (totalAmount === undefined || Number(totalAmount) <= 0) {
      return res.status(400).json({ message: 'Valid total amount is required' });
    }

    if (isMongoConnected()) {
      const order = await Order.create({
        customerName,
        customerPhone,
        customerEmail,
        items: items.map(item => ({
          menuItem: item._id || item.menuItem,
          name: item.name,
          price: Number(item.price),
          quantity: Number(item.quantity) || 1,
          image: item.image || ''
        })),
        totalAmount: Number(totalAmount),
        orderNotes: orderNotes || '',
        status: 'Pending'
      });

      return res.status(201).json({
        message: 'Order placed successfully! Sent to kitchen.',
        order
      });
    }

    // Fallback in-memory
    const newOrder = {
      _id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
      customerName,
      customerPhone,
      customerEmail,
      items: items.map(item => ({
        name: item.name,
        price: Number(item.price),
        quantity: Number(item.quantity) || 1,
        image: item.image || ''
      })),
      totalAmount: Number(totalAmount),
      orderNotes: orderNotes || '',
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    memoryOrders.unshift(newOrder);
    return res.status(201).json({
      message: 'Order placed successfully! Sent to kitchen.',
      order: newOrder
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to place order', error: error.message });
  }
};

/**
 * @desc    Get order details by ID (for customer order confirmation)
 * @route   GET /api/orders/:id
 * @access  Public
 */
const getOrderById = async (req, res) => {
  try {
    if (isMongoConnected()) {
      const order = await Order.findById(req.params.id);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      return res.json(order);
    }

    const order = memoryOrders.find(o => String(o._id) === String(req.params.id));
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    return res.json(order);
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    res.status(500).json({ message: 'Failed to retrieve order', error: error.message });
  }
};

/**
 * @desc    Get all orders (sorted newest first)
 * @route   GET /api/orders
 * @access  Protected (Owner)
 */
const getAllOrders = async (req, res) => {
  try {
    if (isMongoConnected()) {
      const orders = await Order.find().sort({ createdAt: -1 });
      return res.json(orders);
    }
    return res.json(memoryOrders);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};

/**
 * @desc    Get dashboard order statistics (Total, Pending, Preparing, Completed, Revenue)
 * @route   GET /api/orders/stats
 * @access  Protected (Owner)
 */
const getOrderStats = async (req, res) => {
  try {
    if (isMongoConnected()) {
      const totalOrders = await Order.countDocuments();
      const pendingOrders = await Order.countDocuments({ status: 'Pending' });
      const preparingOrders = await Order.countDocuments({ status: 'Preparing' });
      const readyOrders = await Order.countDocuments({ status: 'Ready' });
      const completedOrders = await Order.countDocuments({ status: 'Completed' });
      const cancelledOrders = await Order.countDocuments({ status: 'Cancelled' });

      const revenueResult = await Order.aggregate([
        { $match: { status: { $ne: 'Cancelled' } } },
        { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
      ]);
      const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

      return res.json({
        totalOrders,
        pendingOrders,
        preparingOrders,
        readyOrders,
        completedOrders,
        cancelledOrders,
        totalRevenue
      });
    }

    // In-memory stats
    const totalOrders = memoryOrders.length;
    const pendingOrders = memoryOrders.filter(o => o.status === 'Pending').length;
    const preparingOrders = memoryOrders.filter(o => o.status === 'Preparing').length;
    const readyOrders = memoryOrders.filter(o => o.status === 'Ready').length;
    const completedOrders = memoryOrders.filter(o => o.status === 'Completed').length;
    const cancelledOrders = memoryOrders.filter(o => o.status === 'Cancelled').length;
    const totalRevenue = memoryOrders
      .filter(o => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    return res.json({
      totalOrders,
      pendingOrders,
      preparingOrders,
      readyOrders,
      completedOrders,
      cancelledOrders,
      totalRevenue
    });
  } catch (error) {
    console.error('Error fetching order stats:', error);
    res.status(500).json({ message: 'Failed to compute order statistics', error: error.message });
  }
};

/**
 * @desc    Update order workflow status (Pending -> Preparing -> Ready -> Completed)
 * @route   PATCH /api/orders/:id/status
 * @access  Protected (Owner)
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    if (isMongoConnected()) {
      const order = await Order.findById(req.params.id);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      order.status = status;
      const updatedOrder = await order.save();
      return res.json({
        message: `Order status updated to ${status}`,
        order: updatedOrder
      });
    }

    // In-memory update
    const order = memoryOrders.find(o => String(o._id) === String(req.params.id));
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    return res.json({
      message: `Order status updated to ${status}`,
      order
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Failed to update order status', error: error.message });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getAllOrders,
  getOrderStats,
  updateOrderStatus
};
