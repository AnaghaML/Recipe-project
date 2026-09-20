import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, CheckCircle, ShieldCheck, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import axiosClient from '../api/axiosClient';

export default function CheckoutPage() {
  const { cart, subtotal, gst, deliveryFee, grandTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    orderNotes: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (cart.length === 0) {
      setError('Your cart is empty. Please add items to your order first.');
      return;
    }

    if (!formData.customerName.trim() || !formData.customerPhone.trim() || !formData.customerEmail.trim()) {
      setError('Please fill in all contact details (Name, Phone, and Email).');
      return;
    }

    try {
      setSubmitting(true);

      const orderPayload = {
        customerName: formData.customerName.trim(),
        customerPhone: formData.customerPhone.trim(),
        customerEmail: formData.customerEmail.trim(),
        items: cart.map((item) => ({
          _id: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        totalAmount: grandTotal,
        orderNotes: formData.orderNotes.trim()
      };

      const response = await axiosClient.post('/orders', orderPayload);
      const placedOrder = response.data.order;

      // Clear cart once order is confirmed
      clearCart();

      // Navigate to order confirmation page
      navigate(`/order-confirmation/${placedOrder._id}`);
    } catch (err) {
      console.error('Order placement error:', err);
      setError(
        err.response?.data?.message ||
        'Failed to place your order with the kitchen. Please verify backend connection and try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-empty-container">
        <div className="checkout-empty-card">
          <ShoppingBag size={48} className="empty-cart-icon" />
          <h2>Your Cart is Currently Empty</h2>
          <p>You need to choose some delicious dishes before proceeding to checkout.</p>
          <Link to="/menu" className="btn-primary">
            Explore Restaurant Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Back link */}
        <div className="checkout-nav-bar">
          <Link to="/menu" className="back-link">
            <ArrowLeft size={16} /> Return to Menu
          </Link>
        </div>

        <div className="checkout-header">
          <span className="section-eyebrow">FINAL STEP</span>
          <h1 className="checkout-title">Review & Complete Order</h1>
          <p className="checkout-subtitle">
            Provide your details so the kitchen can prepare and dispatch your meal promptly.
          </p>
        </div>

        {error && (
          <div className="form-error-banner">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <div className="checkout-layout-grid">
          {/* Left: Customer Information Form */}
          <div className="checkout-form-card">
            <h3 className="card-heading">1. Customer Contact Details</h3>
            <form onSubmit={handleSubmit} id="checkout-order-form">
              <div className="form-group">
                <label htmlFor="cust-name">Full Name *</label>
                <input
                  id="cust-name"
                  type="text"
                  name="customerName"
                  placeholder="e.g. Rohan Verma"
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label htmlFor="cust-phone">Phone Number *</label>
                  <input
                    id="cust-phone"
                    type="tel"
                    name="customerPhone"
                    placeholder="e.g. +91 98765 43210"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cust-email">Email Address *</label>
                  <input
                    id="cust-email"
                    type="email"
                    name="customerEmail"
                    placeholder="e.g. rohan@example.com"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="cust-notes">Kitchen Instructions & Notes (Optional)</label>
                <textarea
                  id="cust-notes"
                  name="orderNotes"
                  rows={3}
                  placeholder="e.g. Medium spicy, no cilantro, extra napkins, contact-free pickup..."
                  value={formData.orderNotes}
                  onChange={handleChange}
                />
              </div>

              <div className="form-security-notice">
                <ShieldCheck size={16} className="green-accent" />
                <span>Instant dispatch directly to the kitchen display system.</span>
              </div>
            </form>
          </div>

          {/* Right: Order Summary & Bill Breakdown */}
          <div className="checkout-summary-card">
            <h3 className="card-heading">2. Order Summary ({cart.length} items)</h3>

            <div className="summary-items-list">
              {cart.map((item) => (
                <div key={item._id} className="summary-item-row">
                  <div className="summary-item-left">
                    <img src={item.image} alt={item.name} className="summary-item-thumb" />
                    <div>
                      <h4 className="summary-dish-title">{item.name}</h4>
                      <span className="summary-unit-price">
                        {item.quantity} × ₹{item.price}
                      </span>
                    </div>
                  </div>
                  <strong className="summary-item-total">
                    ₹{item.price * item.quantity}
                  </strong>
                </div>
              ))}
            </div>

            <div className="summary-bill-box">
              <div className="bill-line">
                <span>Items Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="bill-line">
                <span>Restaurant GST (5%)</span>
                <span>₹{gst}</span>
              </div>
              <div className="bill-line">
                <span>Delivery / Packaging</span>
                <span>{deliveryFee === 0 ? <strong className="green-text">FREE</strong> : `₹${deliveryFee}`}</span>
              </div>
              <div className="bill-line total-bill-line">
                <span>Total Amount</span>
                <span className="total-highlight">₹{grandTotal}</span>
              </div>
            </div>

            <button
              type="submit"
              form="checkout-order-form"
              className="confirm-order-btn"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="spinner-icon" /> Placing Order...
                </>
              ) : (
                <>
                  <CheckCircle size={18} /> Confirm & Place Order (₹{grandTotal})
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
