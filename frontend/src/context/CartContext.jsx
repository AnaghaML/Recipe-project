import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('restaurant_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('restaurant_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((x) => String(x._id) === String(item._id));
      if (existing) {
        return prev.map((x) =>
          String(x._id) === String(item._id)
            ? { ...x, quantity: x.quantity + 1 }
            : x
        );
      }
      return [
        ...prev,
        {
          _id: item._id,
          name: item.name,
          price: Number(item.price),
          image: item.image,
          category: item.category,
          quantity: 1
        }
      ];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (itemId, delta) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (String(item._id) === String(itemId)) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => prev.filter((item) => String(item._id) !== String(itemId)));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('restaurant_cart');
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const gst = Math.round(subtotal * 0.05); // 5% GST
  const deliveryFee = cart.length > 0 ? (subtotal > 500 ? 0 : 40) : 0;
  const grandTotal = subtotal + gst + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        openCart,
        closeCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        subtotal,
        gst,
        deliveryFee,
        grandTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
