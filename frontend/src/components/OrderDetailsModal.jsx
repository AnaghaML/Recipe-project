import React, { useState } from 'react';
import { X, Clock, User, Phone, Mail, FileText, CheckCircle2, ChevronRight } from 'lucide-react';

const STATUS_FLOW = ['Pending', 'Preparing', 'Ready', 'Completed'];

export default function OrderDetailsModal({ order, onClose, onUpdateStatus }) {
  const [updating, setUpdating] = useState(false);

  if (!order) return null;

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdating(true);
      await onUpdateStatus(order._id, newStatus);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pending': return 'status-pending';
      case 'Preparing': return 'status-preparing';
      case 'Ready': return 'status-ready';
      case 'Completed': return 'status-completed';
      default: return 'status-default';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content order-modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <span className="modal-eyebrow">ORDER DETAILS</span>
            <h2 className="modal-title">Order #{order._id}</h2>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Status Tracker Banner */}
          <div className="order-status-tracker-card">
            <div className="tracker-header">
              <span className="tracker-label">Current Lifecycle Status:</span>
              <span className={`status-pill ${getStatusBadgeClass(order.status)}`}>
                {order.status}
              </span>
            </div>

            <div className="status-timeline-buttons">
              {STATUS_FLOW.map((s, idx) => {
                const isCurrent = order.status === s;
                return (
                  <button
                    key={s}
                    type="button"
                    disabled={updating}
                    className={`timeline-step-btn ${isCurrent ? 'current' : ''}`}
                    onClick={() => handleStatusChange(s)}
                  >
                    <span>{idx + 1}. {s}</span>
                    {isCurrent && <CheckCircle2 size={14} className="check-icon" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Customer Profile Section */}
          <div className="detail-section">
            <h4 className="section-heading">
              <User size={16} /> Customer Information
            </h4>
            <div className="customer-info-grid">
              <div className="info-block">
                <span className="info-label">Full Name</span>
                <span className="info-value">{order.customerName}</span>
              </div>
              <div className="info-block">
                <span className="info-label">Phone Number</span>
                <span className="info-value">
                  <Phone size={14} /> {order.customerPhone}
                </span>
              </div>
              <div className="info-block">
                <span className="info-label">Email Address</span>
                <span className="info-value">
                  <Mail size={14} /> {order.customerEmail}
                </span>
              </div>
              <div className="info-block">
                <span className="info-label">Order Placed At</span>
                <span className="info-value">
                  <Clock size={14} /> {new Date(order.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            {order.orderNotes && (
              <div className="customer-notes-callout">
                <FileText size={16} />
                <div>
                  <strong>Special Kitchen Instructions:</strong>
                  <p>{order.orderNotes}</p>
                </div>
              </div>
            )}
          </div>

          {/* Ordered Dishes List */}
          <div className="detail-section">
            <h4 className="section-heading">Ordered Items ({order.items?.length || 0})</h4>
            <div className="order-items-table">
              {order.items?.map((item, index) => (
                <div key={index} className="order-table-row">
                  <div className="item-name-qty">
                    <span className="item-qty-badge">{item.quantity}x</span>
                    <span className="item-dish-name">{item.name}</span>
                  </div>
                  <div className="item-cost-calc">
                    <span>₹{item.price} each</span>
                    <strong className="item-total-col">₹{item.price * item.quantity}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total Amount Summary */}
          <div className="order-modal-summary">
            <span>Total Order Value:</span>
            <span className="grand-price-highlight">₹{order.totalAmount}</span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
