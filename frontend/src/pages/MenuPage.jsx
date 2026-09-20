import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Loader2, AlertCircle, Sparkles, RefreshCw } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import MenuCard from '../components/MenuCard';
import CategoryFilter from '../components/CategoryFilter';

export default function MenuPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Keep category in sync with URL search params
  useEffect(() => {
    const urlCat = searchParams.get('category') || 'All';
    setSelectedCategory(urlCat);
  }, [searchParams]);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      setError('');
      // Force fresh data from MongoDB Atlas bypassing browser/HTTP cache
      const res = await axiosClient.get(`/menu?t=${Date.now()}`);
      setMenuItems(res.data);
    } catch (err) {
      console.error('Failed to load menu:', err);
      setError(
        err.response?.data?.message ||
        'Unable to connect to the restaurant menu server. Please make sure the backend is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: cat });
    }
  };

  // Filter items in client-side memory for instantaneous search & category filter responsiveness
  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      item.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      !searchQuery.trim() ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase().trim());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="menu-page">
      {/* Menu Header */}
      <section className="menu-header-section">
        <div className="menu-header-content">
          <span className="section-eyebrow">ARTISAN SELECTIONS</span>
          <h1 className="menu-page-title">Handcrafted Culinary Menu</h1>
          <p className="menu-page-subtitle">
            Every dish is made fresh upon ordering. Browse by category, find your favorites, and customize your order.
          </p>

          {/* Search bar */}
          <div className="menu-search-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search dishes (e.g., Paneer Tikka, Truffle Penne, Mojito)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="menu-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Category Pills Filter */}
      <section className="menu-filter-container">
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />
      </section>

      {/* Menu Grid Section */}
      <section className="menu-items-section">
        {loading ? (
          <div className="loading-state">
            <Loader2 size={36} className="spinner-icon" />
            <p>Gathering fresh recipes from the kitchen...</p>
          </div>
        ) : error ? (
          <div className="error-state-card">
            <AlertCircle size={32} className="error-icon" />
            <h3>Could Not Fetch Menu</h3>
            <p>{error}</p>
            <button type="button" className="btn-primary" onClick={fetchMenu}>
              <RefreshCw size={16} /> Try Again
            </button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="empty-results-box">
            <Sparkles size={36} />
            <h3>No dishes found</h3>
            <p>
              No culinary creations matched your criteria
              {searchQuery ? ` for "${searchQuery}"` : ''} in{' '}
              <strong>{selectedCategory}</strong>.
            </p>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setSearchQuery('');
                handleSelectCategory('All');
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className="menu-results-count">
              <span>
                Showing <strong>{filteredItems.length}</strong> {filteredItems.length === 1 ? 'dish' : 'dishes'}
                {selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}
              </span>
            </div>

            <div className="menu-cards-grid">
              {filteredItems.map((item) => (
                <MenuCard key={item._id} item={item} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}