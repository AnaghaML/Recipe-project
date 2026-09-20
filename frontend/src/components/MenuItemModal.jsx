import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

const CATEGORIES = ['Starters', 'Main Course', 'Desserts', 'Drinks'];

export default function MenuItemModal({ item, onClose, onSave }) {
  const isEditing = Boolean(item && item._id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Starters',
    image: '',
    available: true
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        description: item.description || '',
        price: item.price !== undefined ? String(item.price) : '',
        category: item.category || 'Starters',
        image: item.image || '',
        available: item.available !== undefined ? item.available : true
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Form validation
    if (!formData.name.trim()) {
      return setError('Dish name is required');
    }
    if (!formData.description.trim()) {
      return setError('Description is required');
    }
    if (!formData.price || Number(formData.price) <= 0) {
      return setError('Please enter a valid price greater than 0');
    }
    if (!formData.image.trim()) {
      return setError('Image URL is required');
    }

    try {
      setSubmitting(true);
      await onSave({
        ...formData,
        price: Number(formData.price)
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save menu item');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content menu-item-modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <span className="modal-eyebrow">MENU CATALOG</span>
            <h2 className="modal-title">
              {isEditing ? 'Edit Menu Item' : 'Add New Dish to Menu'}
            </h2>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="modal-form">
          {error && (
            <div className="form-error-banner">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="item-name">Dish Name *</label>
            <input
              id="item-name"
              type="text"
              name="name"
              placeholder="e.g. Crispy Truffle Penne"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="item-category">Category *</label>
              <select
                id="item-category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="item-price">Price (₹ INR) *</label>
              <input
                id="item-price"
                type="number"
                name="price"
                min="1"
                placeholder="e.g. 290"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="item-desc">Description *</label>
            <textarea
              id="item-desc"
              name="description"
              rows={3}
              placeholder="Describe the flavors, preparation, and key ingredients..."
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="item-img">Image URL *</label>
            <input
              id="item-img"
              type="url"
              name="image"
              placeholder="https://images.unsplash.com/..."
              value={formData.image}
              onChange={handleChange}
              required
            />
            {formData.image && (
              <div className="image-preview-box">
                <img
                  src={formData.image}
                  alt="Preview"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <span>Live Image Preview</span>
              </div>
            )}
          </div>

          <div className="form-group-checkbox">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="available"
                checked={formData.available}
                onChange={handleChange}
              />
              <span>Available for ordering (In Stock)</span>
            </label>
          </div>

          {/* Form Actions */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={submitting}
            >
              <Save size={16} />
              {submitting ? 'Saving...' : isEditing ? 'Update Dish' : 'Create Dish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
