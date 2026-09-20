import React from 'react';
import { Plus, Check, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function MenuCard({ item }) {
  const { cart, addToCart } = useCart();

  // Check if item is already in the cart
  const cartItem = cart.find((x) => String(x._id) === String(item._id));
  const isAvailable = item.available !== false;

  return (
    <div className={`menu-card ${!isAvailable ? 'sold-out' : ''}`}>
      {/* Food Image Container */}
      <div className="card-image-wrap">
        <img
          src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop'}
          alt={item.name}
          className="food-img"
          loading="lazy"
        />
        <div className="card-badges">
          <span className="category-tag">{item.category}</span>
          {!isAvailable && (
            <span className="availability-tag out-of-stock">
              <AlertCircle size={12} /> Sold Out
            </span>
          )}
          {isAvailable && (
            <span className="availability-tag in-stock">
              Available
            </span>
          )}
        </div>
      </div>

      {/* Food Details */}
      <div className="card-body">
        <div className="card-title-row">
          <h3 className="item-title">{item.name}</h3>
          <span className="item-price">₹{item.price}</span>
        </div>
        <p className="item-description">{item.description}</p>

        {/* Card Footer & Action */}
        <div className="card-action-row">
          <button
            type="button"
            className={`add-cart-btn ${cartItem ? 'in-cart' : ''}`}
            onClick={() => addToCart(item)}
            disabled={!isAvailable}
          >
            {cartItem ? (
              <>
                <Check size={16} /> Added ({cartItem.quantity})
              </>
            ) : (
              <>
                <Plus size={16} /> Add to Order
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
