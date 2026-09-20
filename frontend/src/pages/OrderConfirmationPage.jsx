import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Clock, MapPin, User, Phone, Mail, ArrowRight, Printer, Loader2, AlertCircle } from 'lucide-react';
import axiosClient from '../api/axiosClient';

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        console.error('Failed to load order confirmation:', err);
        setError('Could not retrieve order details. Please verify your order ID.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="confirmation-loading">
        <Loader2 size={36} className="spinner-icon" />
        <p>Retrieving your order receipt from the kitchen...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="confirmation-error-card">
        <AlertCircle size={40} className="error-icon" />
        <h2>Order Not Found</h2>
        <p>{error || 'No matching order was found with this identifier.'}</p>
        <Link to="/menu" className="btn-primary">
          Back to Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="confirmation-page">
      <div className="confirmation-container">
        {/* Success Splash Card */}
        <div className="confirmation-splash">
          <div className="check-ring">
            <CheckCircle2 size={48} className="check-icon" />
          </div>
          <span className="success-tag">ORDER CONFIRMED</span>
          <h1 className="confirmation-headline">Thank You for Dining With Us!</h1>
          <p className="confirmation-subline">
            Your order has been transmitted directly to our head chef. We are preparing your meal with utmost care.
          </p>

          <div className="order-id-badge">
            <span>Order Reference ID:</span>
            <strong>#{order._id}</strong>
          </div>
        </div>

        {/* Receipt Grid */}
        <div className="receipt-card">
          <div className="receipt-header">
            <div>
              <h3>Order Receipt Summary</h3>
              <span className="receipt-timestamp">
                Placed on {new Date(order.createdAt).toLocaleString()}
              </span>
            </div>
            <div className="receipt-status-wrap">
              <span className="status-label">Current Status:</span>
              <span className={`status-pill status-${order.status?.toLowerCase() || 'pending'}`}>
                {order.status || 'Pending'}
              </span>
            </div>
          </div>

          {/* Customer Details Box */}
          <div className="receipt-customer-details">
            <div className="cust-detail-item">
              <User size={15} />
              <span><strong>Customer:</strong> {order.customerName}</span>
            </div>
            <div className="cust-detail-item">
              <Phone size={15} />
              <span><strong>Contact:</strong> {order.customerPhone}</span>
            </div>
            <div className="cust-detail-item">
              <Mail size={15} />
              <span><strong>Email:</strong> {order.customerEmail}</span>
            </div>
            {order.orderNotes && (
              <div className="cust-detail-item notes-item">
                <span><strong>Special Note:</strong> "{order.orderNotes}"</span>
              </div>
            )}
          </div>

          {/* Ordered Dishes Items Table */}
          <div className="receipt-items-table">
            <div className="receipt-table-head">
              <span>Dish Item</span>
              <span>Qty</span>
              <span>Unit Price</span>
              <span>Total</span>
            </div>
            {order.items?.map((item, idx) => (
              <div key={idx} className="receipt-table-row">
                <span className="dish-name">{item.name}</span>
                <span className="dish-qty">{item.quantity}</span>
                <span className="dish-price">₹{item.price}</span>
                <span className="dish-line-total">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          {/* Grand Total */}
          <div className="receipt-total-footer">
            <span>Grand Total Paid / Due</span>
            <span className="receipt-grand-amount">₹{order.totalAmount}</span>
          </div>

          {/* Action Buttons */}
          <div className="receipt-actions">
            <button
              type="button"
              className="btn-secondary print-btn"
              onClick={() => window.print()}
            >
              <Printer size={16} /> Print Receipt
            </button>
            <Link to="/menu" className="btn-primary">
              Order More Delicacies <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
