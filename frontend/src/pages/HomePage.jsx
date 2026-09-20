import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, ChefHat, Clock, ShieldCheck, Flame, Utensils, Cake, Coffee } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  const handleCategoryClick = (cat) => {
    navigate(`/menu?category=${encodeURIComponent(cat)}`);
  };

  const categories = [
    { name: 'Starters', desc: 'Crispy tikkas, sizzlers & appetizers', icon: Flame, img: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500&auto=format&fit=crop' },
    { name: 'Main Course', desc: 'Royal gravies, pizzas, pastas & platters', icon: Utensils, img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop' },
    { name: 'Desserts', desc: 'Molten chocolate, sizzling brownies & sweets', icon: Cake, img: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=500&auto=format&fit=crop' },
    { name: 'Drinks', desc: 'Artisan cold brews, shakes & mojitos', icon: Coffee, img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop' }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={16} className="gold-accent" />
            <span>Award-Winning Artisan Dining</span>
          </div>

          <h1 className="hero-headline">
            Where Royal Heritage Meets <span className="highlight-text">Culinary Modernism</span>
          </h1>

          <p className="hero-description">
            Experience meticulously handcrafted dishes prepared by master chefs using organic, locally-sourced ingredients. Browse our categorized menu and place your order directly to the kitchen in seconds.
          </p>

          <div className="hero-cta-group">
            <Link to="/menu" className="btn-primary hero-btn">
              <span>Explore Full Menu</span>
              <ArrowRight size={18} />
            </Link>
            <button
              type="button"
              className="btn-secondary hero-btn"
              onClick={() => handleCategoryClick('Starters')}
            >
              Order Starters
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="hero-metrics">
            <div className="metric-box">
              <strong>4.9 ★</strong>
              <span>5,000+ Reviews</span>
            </div>
            <div className="metric-divider"></div>
            <div className="metric-box">
              <strong>25 Min</strong>
              <span>Avg Kitchen Time</span>
            </div>
            <div className="metric-divider"></div>
            <div className="metric-box">
              <strong>100%</strong>
              <span>Fresh Ingredients</span>
            </div>
          </div>
        </div>
      </section>

      {/* Culinary Categories Section */}
      <section className="home-section categories-section">
        <div className="section-header">
          <span className="section-eyebrow">OUR SPECIALTIES</span>
          <h2 className="section-title">Explore by Category</h2>
          <p className="section-subtitle">
            Select a collection below to discover flavors curated for every mood and palate.
          </p>
        </div>

        <div className="category-card-grid">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.name}
                className="home-category-card"
                onClick={() => handleCategoryClick(cat.name)}
                role="button"
                tabIndex={0}
              >
                <div className="category-img-wrap">
                  <img src={cat.img} alt={cat.name} />
                  <div className="cat-icon-badge">
                    <Icon size={20} />
                  </div>
                </div>
                <div className="cat-card-body">
                  <h3>{cat.name}</h3>
                  <p>{cat.desc}</p>
                  <span className="cat-explore-link">
                    View Dishes <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features & Why Choose Us */}
      <section className="home-section features-section">
        <div className="section-header">
          <span className="section-eyebrow">THE GRAND STANDARD</span>
          <h2 className="section-title">Why Dine With Us</h2>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-box">
              <ChefHat size={28} />
            </div>
            <h3>Master Chef Recipes</h3>
            <p>Every sauce, marinade, and spice blend is created in-house from scratch using authentic secret recipes.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-box">
              <Clock size={28} />
            </div>
            <h3>Direct Kitchen Dispatch</h3>
            <p>Your orders flow straight from your table or couch directly to the kitchen display screen without delay.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-box">
              <ShieldCheck size={28} />
            </div>
            <h3>Premium Freshness</h3>
            <p>Zero artificial preservatives or frozen gravies. Fresh produce delivered daily from local artisan farmers.</p>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="cta-banner-section">
        <div className="cta-banner-inner">
          <div className="cta-text">
            <h2>Ready to Taste Excellence?</h2>
            <p>Add your favorite appetizers, main courses, desserts, and brews in just a few clicks.</p>
          </div>
          <Link to="/menu" className="btn-primary cta-btn">
            Order Now <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}