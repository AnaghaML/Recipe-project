import React from 'react';
import { Sparkles, Utensils, Coffee, Cake, Flame } from 'lucide-react';

const categories = [
  { id: 'All', label: 'All Items', icon: Sparkles },
  { id: 'Starters', label: 'Starters', icon: Flame },
  { id: 'Main Course', label: 'Main Course', icon: Utensils },
  { id: 'Desserts', label: 'Desserts', icon: Cake },
  { id: 'Drinks', label: 'Drinks & Brews', icon: Coffee }
];

export default function CategoryFilter({ selectedCategory, onSelectCategory }) {
  return (
    <div className="category-filter-wrapper">
      <div className="category-pills">
        {categories.map((cat) => {
          const IconComponent = cat.icon;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              className={`category-pill ${isSelected ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat.id)}
            >
              <IconComponent size={17} className="pill-icon" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
