const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem');
const initialMenuItems = require('../data/initialMenu');

// In-memory fallback store initialized with default dishes
let memoryMenuItems = [...initialMenuItems];

/**
 * Helper to determine whether MongoDB is currently connected
 */
const isMongoConnected = () => mongoose.connection.readyState === 1;

/**
 * @desc    Get all menu items (optional filter by category or search)
 * @route   GET /api/menu
 * @access  Public
 */
const getMenuItems = async (req, res) => {
  try {
    const { category, search } = req.query;

    if (isMongoConnected()) {
      let query = {};
      if (category && category !== 'All') {
        query.category = category;
      }
      if (search) {
        query.name = { $regex: search, $options: 'i' };
      }
      const items = await MenuItem.find(query).sort({ createdAt: -1 });
      return res.json(items);
    }

    // Fallback in-memory
    let filtered = [...memoryMenuItems];
    if (category && category !== 'All') {
      filtered = filtered.filter(item => item.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      filtered = filtered.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    }
    return res.json(filtered);
  } catch (error) {
    console.error('Error fetching menu:', error);
    res.status(500).json({ message: 'Failed to fetch menu items', error: error.message });
  }
};

/**
 * @desc    Get a single menu item by ID
 * @route   GET /api/menu/:id
 * @access  Public
 */
const getMenuItemById = async (req, res) => {
  try {
    if (isMongoConnected()) {
      const item = await MenuItem.findById(req.params.id);
      if (!item) {
        return res.status(404).json({ message: 'Menu item not found' });
      }
      return res.json(item);
    }

    const item = memoryMenuItems.find(i => String(i._id) === String(req.params.id));
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    return res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch item', error: error.message });
  }
};

/**
 * @desc    Create a new menu item
 * @route   POST /api/menu
 * @access  Protected (Owner)
 */
const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, image, available } = req.body;

    if (!name || !description || price === undefined || !category || !image) {
      return res.status(400).json({ message: 'Please provide all required fields (name, description, price, category, image)' });
    }

    if (isMongoConnected()) {
      const newItem = await MenuItem.create({
        name,
        description,
        price: Number(price),
        category,
        image,
        available: available !== undefined ? Boolean(available) : true
      });
      return res.status(201).json({ message: 'Menu item created successfully', item: newItem });
    }

    // Fallback in-memory
    const newItem = {
      _id: 'dish-' + Date.now(),
      name,
      description,
      price: Number(price),
      category,
      image,
      available: available !== undefined ? Boolean(available) : true,
      createdAt: new Date().toISOString()
    };
    memoryMenuItems.unshift(newItem);
    return res.status(201).json({ message: 'Menu item created successfully', item: newItem });
  } catch (error) {
    console.error('Error creating menu item:', error);
    res.status(500).json({ message: 'Failed to create menu item', error: error.message });
  }
};

/**
 * @desc    Update an existing menu item
 * @route   PUT /api/menu/:id
 * @access  Protected (Owner)
 */
const updateMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, image, available } = req.body;

    if (isMongoConnected()) {
      const item = await MenuItem.findById(req.params.id);
      if (!item) {
        return res.status(404).json({ message: 'Menu item not found' });
      }

      if (name) item.name = name;
      if (description) item.description = description;
      if (price !== undefined) item.price = Number(price);
      if (category) item.category = category;
      if (image) item.image = image;
      if (available !== undefined) item.available = Boolean(available);

      const updatedItem = await item.save();
      return res.json({ message: 'Menu item updated successfully', item: updatedItem });
    }

    // Fallback in-memory
    const index = memoryMenuItems.findIndex(i => String(i._id) === String(req.params.id));
    if (index === -1) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    memoryMenuItems[index] = {
      ...memoryMenuItems[index],
      ...(name && { name }),
      ...(description && { description }),
      ...(price !== undefined && { price: Number(price) }),
      ...(category && { category }),
      ...(image && { image }),
      ...(available !== undefined && { available: Boolean(available) })
    };

    return res.json({ message: 'Menu item updated successfully', item: memoryMenuItems[index] });
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({ message: 'Failed to update menu item', error: error.message });
  }
};

/**
 * @desc    Delete a menu item
 * @route   DELETE /api/menu/:id
 * @access  Protected (Owner)
 */
const deleteMenuItem = async (req, res) => {
  try {
    if (isMongoConnected()) {
      const item = await MenuItem.findById(req.params.id);
      if (!item) {
        return res.status(404).json({ message: 'Menu item not found' });
      }
      await MenuItem.findByIdAndDelete(req.params.id);
      return res.json({ message: 'Menu item deleted successfully', id: req.params.id });
    }

    // Fallback in-memory
    const index = memoryMenuItems.findIndex(i => String(i._id) === String(req.params.id));
    if (index === -1) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    memoryMenuItems.splice(index, 1);
    return res.json({ message: 'Menu item deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({ message: 'Failed to delete menu item', error: error.message });
  }
};

module.exports = {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
};
