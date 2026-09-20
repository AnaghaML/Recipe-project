import React from 'react';
import { UtensilsCrossed, Phone, MapPin, Clock, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-col brand-col">
          <div className="footer-logo">
            <UtensilsCrossed size={22} className="logo-icon" />
            <span className="brand-title">THE GRAND BISTRO</span>
          </div>
          <p className="footer-description">
            Experience culinary excellence where modern gastronomic craftsmanship meets warm royal hospitality.
          </p>
          <div className="footer-badges">
            <span className="badge">⭐ 4.9 Foodie Choice</span>
            <span className="badge">🌱 Pure Fresh Ingredients</span>
          </div>
        </div>

        <div className="footer-col">
          <h4>Timings & Hours</h4>
          <ul className="footer-list">
            <li><Clock size={16} /> Mon – Fri: 11:30 AM – 11:00 PM</li>
            <li><Clock size={16} /> Sat – Sun: 11:00 AM – 11:30 PM</li>
            <li>✨ Kitchen accepts orders till 10:45 PM</li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Location & Contact</h4>
          <ul className="footer-list">
            <li><MapPin size={16} /> 42 Gourmet Avenue, Indiranagar, Bengaluru</li>
            <li><Phone size={16} /> +91 98765 43210</li>
            <li>✉️ reservations@thegrandbistro.com</li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Quick Access</h4>
          <ul className="footer-links">
            <li><Link to="/">Home Showcase</Link></li>
            <li><Link to="/menu">Explore Full Menu</Link></li>
            <li><Link to="/owner/login">Owner Management Portal</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} The Grand Bistro. Built with MongoDB, Express.js, React & Node.js.</p>
        <p className="footer-tagline">
          Crafted with <Heart size={14} className="heart-icon" /> for food lovers.
        </p>
      </div>
    </footer>
  );
}
