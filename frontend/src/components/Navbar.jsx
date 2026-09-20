import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, UtensilsCrossed, ShieldCheck, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { totalItems, openCart } = useCart();
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const isOwnerRoute = location.pathname.startsWith('/owner');

  return (
    <header className="site-header">
      <div className="header-container">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo">
          <div className="logo-icon-wrap">
            <UtensilsCrossed size={22} className="logo-icon" />
          </div>
          <div className="logo-text">
            <span className="brand-title">THE GRAND BISTRO</span>
            <span className="brand-subtitle">Artisan Cuisine & Bar</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="main-nav">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link
            to="/menu"
            className={`nav-link ${location.pathname === '/menu' ? 'active' : ''}`}
          >
            Menu
          </Link>
        </nav>

        {/* Action Controls */}
        <div className="header-actions">
          {/* Customer Cart Button (hidden on owner dashboard to reduce clutter) */}
          {!isOwnerRoute && (
            <button
              type="button"
              className="cart-trigger-btn"
              onClick={openCart}
              aria-label="Open shopping cart"
            >
              <ShoppingBag size={20} />
              <span className="cart-text">Cart</span>
              {totalItems > 0 && (
                <span className="cart-badge">{totalItems}</span>
              )}
            </button>
          )}

          {/* Owner Portal Links */}
          {isAuthenticated ? (
            <div className="owner-nav-cluster">
              <Link to="/owner/dashboard" className="owner-dashboard-link">
                <ShieldCheck size={18} />
                <span>Dashboard</span>
              </Link>
              <button
                type="button"
                onClick={logout}
                className="owner-logout-btn"
                title="Log out from owner dashboard"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/owner/login" className="owner-login-link">
              <ShieldCheck size={16} />
              <span>Owner Login</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
