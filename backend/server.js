const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// 20 Unique Food Items with Verified Custom Unsplash Direct Links
let menuItems = [
  // --- SOUTH INDIAN ---
  { 
    _id: "1", 
    name: "Ghee Roast Masala Dosa", 
    category: "South Indian", 
    price: 189, 
    isVeg: true, 
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80", 
    description: "Crispy golden crepe smeared with pure desi ghee, filled with spiced potato masala." 
  },
  { 
    _id: "2", 
    name: "Crispy Medu Vada (2 Pcs)", 
    category: "South Indian", 
    price: 129, 
    isVeg: true, 
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80", 
    description: "Deep-fried golden lentil donuts served with piping hot sambar & fresh coconut chutney." 
  },
  { 
    _id: "3", 
    name: "Cheese Butter Podi Idli", 
    category: "South Indian", 
    price: 169, 
    isVeg: true, 
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80", 
    description: "Steamed mini idlis tossed in spicy gun powder chutney, melted butter & grated cheese." 
  },

  // --- PASTAS ---
  { 
    _id: "4", 
    name: "Classic White Sauce Fettuccine", 
    category: "Pastas", 
    price: 329, 
    isVeg: true, 
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=600&q=80", 
    description: "Creamy Béchamel white sauce tossed with ribbon fettuccine, garlic herbs & sweet corn." 
  },
  { 
    _id: "5", 
    name: "Spicy Arrabbiata Penne Pasta", 
    category: "Pastas", 
    price: 319, 
    isVeg: true, 
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80", 
    description: "Al dente penne in fiery San Marzano red tomato sauce, garlic, chili flakes & fresh basil." 
  },
  { 
    _id: "6", 
    name: "Creamy Chicken Alfredo Rigatoni", 
    category: "Pastas", 
    price: 429, 
    isVeg: false, 
    image: "https://images.unsplash.com/photo-1621996346565-e3d5d6281363?auto=format&fit=crop&w=600&q=80", 
    description: "Seared chicken breast strips over rigatoni in rich parmesan butter cream sauce." 
  },
  { 
    _id: "7", 
    name: "Truffle Wild Mushroom Fusilli", 
    category: "Pastas", 
    price: 389, 
    isVeg: true, 
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80", 
    description: "Spiral fusilli tossed in white truffle oil, sautéed mushroom crema & parmesan." 
  },

  // --- INDIAN STREET CHAATS ---
  { 
    _id: "8", 
    name: "Pani Puri Teekha Shots (8 Pcs)", 
    category: "Chaats", 
    price: 99, 
    isVeg: true, 
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80", 
    description: "Crispy puris stuffed with potato-chickpea masala, served with chilled spicy mint pani." 
  },
  { 
    _id: "9", 
    name: "Bangalore Masala Puri Supreme", 
    category: "Chaats", 
    price: 119, 
    isVeg: true, 
    image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=600&q=80", 
    description: "Crushed puris loaded with hot spiced green pea curry, raw onions, cilantro & fine nylon sev." 
  },
  { 
    _id: "10", 
    name: "Royal Sweet Dahi Puri", 
    category: "Chaats", 
    price: 139, 
    isVeg: true, 
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80", 
    description: "Crispy puris layered with sweet chilled curd, date-tamarind chutney & pomegranate seeds." 
  },
  { 
    _id: "11", 
    name: "Crispy Punjabi Samosa Platter", 
    category: "Chaats", 
    price: 109, 
    isVeg: true, 
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80", 
    description: "Golden fried savory pastry cones loaded with spiced potato masala & mint chutney." 
  },
  { 
    _id: "12", 
    name: "Mumbai Butter Pav Bhaji", 
    category: "Chaats", 
    price: 199, 
    isVeg: true, 
    image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=600&q=80", 
    description: "Mashed vegetable curry cooked with signature spices & butter, served with butter-toasted pav." 
  },

  // --- DESSERTS & ICE CREAMS ---
  { 
    _id: "13", 
    name: "Mangalore Gudbud Sundae", 
    category: "Desserts & Ice Creams", 
    price: 279, 
    isVeg: true, 
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80", 
    description: "Iconic triple-layer sundae with vanilla, strawberry, mango ice creams, jellies & nuts." 
  },
  { 
    _id: "14", 
    name: "Royal Kesar Pista Falooda", 
    category: "Desserts & Ice Creams", 
    price: 249, 
    isVeg: true, 
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80", 
    description: "Rose syrup milk with basil seeds, vermicelli, saffron ice cream & chopped pistachios." 
  },
  { 
    _id: "15", 
    name: "Death By Chocolate (DBC) Loaded", 
    category: "Desserts & Ice Creams", 
    price: 299, 
    isVeg: true, 
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80", 
    description: "Warm chocolate brownie, double dark chocolate scoops, hot fudge & roasted almonds." 
  },
  { 
    _id: "16", 
    name: "New York Berry Cheesecake", 
    category: "Desserts & Ice Creams", 
    price: 289, 
    isVeg: true, 
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80", 
    description: "Baked graham crust cream cheesecake topped with sweet blueberry compote." 
  },

  // --- BURGERS & PIZZA ---
  { 
    _id: "17", 
    name: "Truffle Lamb Smash Burger", 
    category: "Burgers", 
    price: 349, 
    isVeg: false, 
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80", 
    description: "Double smashed lamb patty, truffle mayo, caramelized onions & melted cheddar." 
  },
  { 
    _id: "18", 
    name: "Artisan Margherita Woodfired Pizza", 
    category: "Pizza", 
    price: 449, 
    isVeg: true, 
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=600&q=80", 
    description: "Woodfired dough crust, San Marzano tomato sauce, fresh mozzarella & basil leaves." 
  },

  // --- DRINKS ---
  { 
    _id: "19", 
    name: "Alphonso Mango Mojito", 
    category: "Drinks", 
    price: 159, 
    isVeg: true, 
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80", 
    description: "Crushed mango pulp, fresh mint leaves, lime juice & sparkling soda on ice." 
  },
  { 
    _id: "20", 
    name: "Iced Matcha Oat Milk Latte", 
    category: "Drinks", 
    price: 189, 
    isVeg: true, 
    image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80", 
    description: "Whisked Japanese ceremonial matcha poured over cold oat milk and ice." 
  }
];

let orders = [];

app.get('/api/menu', (req, res) => res.json(menuItems));

app.post('/api/orders', (req, res) => {
  const { items, totalAmount, orderNotes } = req.body;
  const newOrder = { id: Date.now(), items, totalAmount, orderNotes: orderNotes || "", status: "Pending" };
  orders.push(newOrder);
  res.status(201).json({ message: "Order placed successfully!", order: newOrder });
});

app.listen(5000, () => console.log('Backend server running on http://localhost:5000'));