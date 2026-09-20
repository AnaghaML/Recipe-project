import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    gst,
    deliveryFee,
    grandTotal,
    totalItems
  } = useCart();

  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckoutClick = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <div className="cart-drawer-overlay" onClick={closeCart}>
      <aside
        className="cart-drawer-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Drawer Header */}
        <div className="cart-drawer-header">
          <div className="drawer-title-wrap">
            <ShoppingBag size={20} className="gold-accent" />
            <h2>Your Order ({totalItems})</h2>
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={closeCart}
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Body: Empty or List */}
        <div className="cart-drawer-body">
          {cart.length === 0 ? (
            <div className="empty-cart-view">
              <div className="empty-icon-wrap">
                <ShoppingBag size={48} />
              </div>
              <h3>Your cart is empty</h3>
              <p>Add some exquisite delicacies from our handcrafted menu to begin.</p>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  closeCart();
                  navigate('/menu');
                }}
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="cart-items-scroll">
              <div className="cart-items-list">
                {cart.map((item) => (
                  <div key={item._id} className="cart-item-row">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="cart-item-thumb"
                    />
                    <div className="cart-item-details">
                      <h4 className="cart-item-name">{item.name}</h4>
                      <span className="cart-item-price">₹{item.price} each</span>
                      <div className="cart-item-sub">
                        Item Total: ₹{item.price * item.quantity}
                      </div>
                    </div>

                    <div className="cart-item-actions">
                      <div className="quantity-stepper">
                        <button
                          type="button"
                          className="step-btn"
                          onClick={() => updateQuantity(item._id, -1)}
                          title="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="quantity-val">{item.quantity}</span>
                        <button
                          type="button"
                          className="step-btn"
                          onClick={() => updateQuantity(item._id, 1)}
                          title="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => removeFromCart(item._id)}
                        title="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-clear-wrap">
                <button
                  type="button"
                  className="clear-cart-link"
                  onClick={clearCart}
                >
                  Clear all items
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer: Calculations & Checkout */}
        {cart.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="bill-breakdown">
              <div className="bill-row">
                <span>Items Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="bill-row">
                <span>Restaurant GST (5%)</span>
                <span>₹{gst}</span>
              </div>
              <div className="bill-row">
                <span>Packaging & Delivery</span>
                <span>{deliveryFee === 0 ? <strong className="green-text">FREE</strong> : `₹${deliveryFee}`}</span>
              </div>
              {subtotal <= 500 && (
                <p className="free-delivery-tip">
                  💡 Add ₹{500 - subtotal} more for free delivery!
                </p>
              )}
              <div className="bill-row total-row">
                <span>Grand Total</span>
                <span className="total-value">₹{grandTotal}</span>
              </div>
            </div>

            <button
              type="button"
              className="checkout-proceed-btn"
              onClick={handleCheckoutClick}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
