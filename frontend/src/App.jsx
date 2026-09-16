import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingBag, Plus, Minus, CheckCircle, Flame, Sparkles, IceCream, Utensils, FlameKindling, MessageSquare } from 'lucide-react';
import './App.css';

export default function App() {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedToppings, setSelectedToppings] = useState({});
  const [orderNotes, setOrderNotes] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);

  const categories = [
    'All', 
    'South Indian', 
    'Pastas', 
    'Chaats', 
    'Desserts & Ice Creams', 
    'Burgers', 
    'Pizza', 
    'Drinks'
  ];

  // 1. Options exclusively for Burgers & Pizza
  const savoryAddons = [
    { name: "Extra Cheese", price: 49 },
    { name: "Jalapeños", price: 29 },
    { name: "Truffle Oil Drizzle", price: 69 }
  ];

  // 2. Options exclusively for Pastas (Italian)
  const pastaAddons = [
    { name: "Extra Parmesan Cheese", price: 49 },
    { name: "Garlic Butter Toast (2 Pcs)", price: 39 },
    { name: "Extra White Béchamel Cream", price: 45 }
  ];

  // 3. Options exclusively for Chaats (Indian Street Food)
  const chaatAddons = [
    { name: "Extra Sweet Dahi (Curd)", price: 25 },
    { name: "Loaded Nylon Sev", price: 20 },
    { name: "Extra Butter Pav (1 Pair)", price: 30 },
    { name: "Extra Spicy Meetha Chutney", price: 15 }
  ];

  // 4. Options exclusively for Desserts & Ice Creams
  const dessertAddons = [
    { name: "Extra Vanilla Scoop", price: 40 },
    { name: "Extra Chocolate Scoop", price: 50 },
    { name: "DBC Loaded Drizzle & Nuts", price: 79 },
    { name: "Hot Fudge Shot", price: 35 }
  ];

  useEffect(() => {
    axios.get('http://localhost:5000/api/menu')
      .then(res => setMenu(res.data))
      .catch(err => console.error("Error fetching menu:", err));
  }, []);

  const toggleTopping = (itemId, topping) => {
    setSelectedToppings(prev => {
      const current = prev[itemId] || [];
      const exists = current.find(t => t.name === topping.name);
      const updated = exists
        ? current.filter(t => t.name !== topping.name)
        : [...current, topping];
      return { ...prev, [itemId]: updated };
    });
  };

  const getItemPrice = (item) => {
    const toppings = selectedToppings[item._id] || [];
    const toppingsTotal = toppings.reduce((sum, t) => sum + t.price, 0);
    return item.price + toppingsTotal;
  };

  const addToCart = (item) => {
    const toppings = selectedToppings[item._id] || [];
    const finalPrice = getItemPrice(item);
    
    const customId = item._id + '-' + toppings.map(t => t.name).sort().join('-');

    setCart(prev => {
      const existing = prev.find(x => x.cartKey === customId);
      if (existing) {
        return prev.map(x => x.cartKey === customId ? { ...x, quantity: x.quantity + 1 } : x);
      }
      return [...prev, { 
        ...item, 
        cartKey: customId,
        price: finalPrice, 
        chosenToppings: toppings, 
        quantity: 1 
      }];
    });
  };

  const updateQuantity = (cartKey, delta) => {
    setCart(prev => prev.map(item => {
      if (item.cartKey === cartKey) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const calculateTotal = () => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    try {
      await axios.post('http://localhost:5000/api/orders', {
        items: cart,
        totalAmount: calculateTotal(),
        orderNotes
      });
      setOrderSuccess(true);
      setCart([]);
      setOrderNotes('');
      setTimeout(() => setOrderSuccess(false), 4000);
    } catch (err) {
      alert("Failed to place order.");
    }
  };

  const filteredMenu = selectedCategory === 'All' 
    ? menu 
    : menu.filter(item => item.category === selectedCategory);

  return (
    <div className="savore-app">
      <nav className="navbar">
        <div className="brand">
          <h1>SAVORÉ</h1>
          <span className="badge">Gourmet Edition</span>
        </div>
        <div className="cart-counter">
          <ShoppingBag size={20} />
          <span>{cart.reduce((a, b) => a + b.quantity, 0)} items</span>
        </div>
      </nav>

      <div className="main-layout">
        <section className="menu-container">
          <div className="hero-banner">
            <h2>Crafted with Passion <Flame className="flame-icon" size={24} /></h2>
            <p>Select from our artisanal kitchen offerings</p>
          </div>

          <div className="category-chips">
            {categories.map(cat => (
              <button
                key={cat}
                className={`chip ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="food-grid">
            {filteredMenu.map(item => {
              const activeToppings = selectedToppings[item._id] || [];
              const finalPrice = getItemPrice(item);

              const isSavory = item.category === 'Burgers' || item.category === 'Pizza';
              const isPasta = item.category === 'Pastas';
              const isChaat = item.category === 'Chaats';
              const isDessert = item.category === 'Desserts & Ice Creams';

              return (
                <div key={item._id} className="food-card">
                  <div className="card-img-wrapper">
                    <img src={item.image} alt={item.name} />
                    <span className={`diet-badge ${item.isVeg ? 'veg' : 'non-veg'}`}>
                      <span className="dot"></span>
                    </span>
                    <span className="price-tag">₹{finalPrice}</span>
                  </div>
                  <div className="card-details">
                    <h3>{item.name}</h3>
                    <p className="description">{item.description}</p>
                    
                    {/* Burgers & Pizza Customization */}
                    {isSavory && (
                      <div className="customization-box">
                        <span className="custom-title"><Sparkles size={12} /> Add Extra Toppings:</span>
                        <div className="toppings-list">
                          {savoryAddons.map(t => {
                            const isSelected = activeToppings.some(x => x.name === t.name);
                            return (
                              <button
                                key={t.name}
                                type="button"
                                className={`topping-btn ${isSelected ? 'selected' : ''}`}
                                onClick={() => toggleTopping(item._id, t)}
                              >
                                {isSelected ? '✓ ' : '+ '}{t.name} (+₹{t.price})
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Pastas Customization (Italian Specific) */}
                    {isPasta && (
                      <div className="customization-box">
                        <span className="custom-title"><Utensils size={12} /> Pasta Customizations:</span>
                        <div className="toppings-list">
                          {pastaAddons.map(t => {
                            const isSelected = activeToppings.some(x => x.name === t.name);
                            return (
                              <button
                                key={t.name}
                                type="button"
                                className={`topping-btn ${isSelected ? 'selected' : ''}`}
                                onClick={() => toggleTopping(item._id, t)}
                              >
                                {isSelected ? '✓ ' : '+ '}{t.name} (+₹{t.price})
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Chaats Customization (Street Food Specific) */}
                    {isChaat && (
                      <div className="customization-box">
                        <span className="custom-title"><FlameKindling size={12} /> Chaat Extras & Chutneys:</span>
                        <div className="toppings-list">
                          {chaatAddons.map(t => {
                            const isSelected = activeToppings.some(x => x.name === t.name);
                            return (
                              <button
                                key={t.name}
                                type="button"
                                className={`topping-btn ${isSelected ? 'selected' : ''}`}
                                onClick={() => toggleTopping(item._id, t)}
                              >
                                {isSelected ? '✓ ' : '+ '}{t.name} (+₹{t.price})
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Desserts Customization */}
                    {isDessert && (
                      <div className="customization-box">
                        <span className="custom-title"><IceCream size={12} /> Scoops & DBC Add-ons:</span>
                        <div className="toppings-list">
                          {dessertAddons.map(t => {
                            const isSelected = activeToppings.some(x => x.name === t.name);
                            return (
                              <button
                                key={t.name}
                                type="button"
                                className={`topping-btn ${isSelected ? 'selected' : ''}`}
                                onClick={() => toggleTopping(item._id, t)}
                              >
                                {isSelected ? '✓ ' : '+ '}{t.name} (+₹{t.price})
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <button className="add-btn" onClick={() => addToCart(item)}>
                      <Plus size={16} /> Add to Order (₹{finalPrice})
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Sidebar Cart */}
        <aside className="cart-sidebar">
          <h3>Your Order</h3>
          
          {orderSuccess && (
            <div className="success-toast">
              <CheckCircle size={18} /> Order Sent to Kitchen! 🎉
            </div>
          )}

          {cart.length === 0 ? (
            <div className="empty-cart">Cart is currently empty</div>
          ) : (
            <>
              <div className="cart-items-list">
                {cart.map(item => (
                  <div key={item.cartKey} className="cart-item">
                    <div className="item-info">
                      <h4>{item.name}</h4>
                      {item.chosenToppings?.length > 0 && (
                        <p className="topping-note">
                          + {item.chosenToppings.map(t => t.name).join(', ')}
                        </p>
                      )}
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                    <div className="qty-controls">
                      <button onClick={() => updateQuantity(item.cartKey, -1)}><Minus size={14} /></button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.cartKey, 1)}><Plus size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-notes-box">
                <label><MessageSquare size={14} /> Cooking Instructions / Notes:</label>
                <input 
                  type="text" 
                  placeholder="e.g., Make Pani Puri extra teekha, less butter..." 
                  value={orderNotes}
                  onChange={e => setOrderNotes(e.target.value)}
                />
              </div>

              <div className="cart-footer">
                <div className="total-row">
                  <span>Total Amount</span>
                  <strong>₹{calculateTotal()}</strong>
                </div>
                <button className="checkout-btn" onClick={handleCheckout}>
                  Confirm & Place Order
                </button>
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}