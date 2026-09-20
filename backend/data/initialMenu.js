const initialMenuItems = [
  // ──── STARTERS ────
  {
    _id: "starter-1",
    name: "Crispy Paneer Tikka",
    description: "Marinated cottage cheese cubes chargrilled with bell peppers, onions, and aromatic tandoori spices.",
    price: 260,
    category: "Starters",
    image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop",
    available: true
  },
  {
    _id: "starter-2",
    name: "Loaded Peri-Peri Fries",
    description: "Golden crispy potato fries tossed in fiery African peri-peri dust, drizzled with spicy garlic mayo.",
    price: 180,
    category: "Starters",
    image: "https://images.unsplash.com/photo-1585109649139-366815a0d713?w=600&auto=format&fit=crop",
    available: true
  },
  {
    _id: "starter-3",
    name: "Golden Cheese Corn Balls",
    description: "Crispy panko-crusted spheres stuffed with molten mozzarella cheese, sweet corn, and herbs.",
    price: 220,
    category: "Starters",
    image: "https://images.unsplash.com/photo-1541529086526-db283c563270?w=600&auto=format&fit=crop",
    available: true
  },
  {
    _id: "starter-4",
    name: "Crispy Veg Spring Rolls",
    description: "Thin pastry sheets wrapped around shredded Asian vegetables and noodles, served with sweet chili sauce.",
    price: 210,
    category: "Starters",
    image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&auto=format&fit=crop",
    available: true
  },
  {
    _id: "starter-5",
    name: "Tandoori Stuffed Mushrooms",
    description: "Juicy whole button mushrooms filled with spiced paneer, roasted over charcoal.",
    price: 240,
    category: "Starters",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop",
    available: true
  },

  // ──── MAIN COURSE ────
  {
    _id: "main-1",
    name: "Paneer Butter Masala Royal Combo",
    description: "Rich and creamy cottage cheese cubes in silky tomato butter gravy, served with 2 butter garlic naans.",
    price: 360,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop",
    available: true
  },
  {
    _id: "main-2",
    name: "Creamy Truffle Penne Alfredo",
    description: "Al dente penne pasta bathed in a velvety parmesan cream sauce infused with white truffle essence.",
    price: 380,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=600&auto=format&fit=crop",
    available: true
  },
  {
    _id: "main-3",
    name: "Dal Makhani Grand Platter",
    description: "Slow-cooked black lentils simmered overnight with butter and fresh cream, served with jeera basmati rice.",
    price: 320,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop",
    available: true
  },
  {
    _id: "main-4",
    name: "Wood-Fired Margherita Pizza",
    description: "Handcrafted thin sourdough crust with San Marzano tomato sauce, fresh buffalo mozzarella, and basil leaves.",
    price: 420,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=600&auto=format&fit=crop",
    available: true
  },
  {
    _id: "main-5",
    name: "Smoky BBQ Gourmet Burger",
    description: "Charred plant-protein patty with caramelized balsamic onions, sharp cheddar, lettuce, and smoky barbecue glaze.",
    price: 290,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop",
    available: true
  },

  // ──── DESSERTS ────
  {
    _id: "dessert-1",
    name: "Death By Chocolate Sizzler",
    description: "Warm fudgy brownie topped with double dark chocolate scoops, molten hot fudge drizzle, and roasted cashews.",
    price: 250,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop",
    available: true
  },
  {
    _id: "dessert-2",
    name: "Royal Gulab Jamun with Chilled Rabdi",
    description: "Golden fried milk dumplings soaked in saffron cardamom syrup, served on a bed of thick chilled rabdi.",
    price: 190,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1605197584547-c93ee1456488?w=600&auto=format&fit=crop",
    available: true
  },
  {
    _id: "dessert-3",
    name: "Belgian Chocolate Waffle",
    description: "Crispy freshly-baked golden waffle smothered in rich Belgian milk chocolate and dusted with powdered sugar.",
    price: 230,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=600&auto=format&fit=crop",
    available: true
  },
  {
    _id: "dessert-4",
    name: "Classic New York Cheesecake",
    description: "Velvety smooth cream cheese baked over a buttery graham cracker crust, topped with strawberry coulis.",
    price: 270,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&auto=format&fit=crop",
    available: true
  },

  // ──── DRINKS ────
  {
    _id: "drink-1",
    name: "Classic Virgin Mojito",
    description: "Refreshing muddled fresh garden mint, zesty lime wedges, simple cane syrup, and sparkling fizz over crushed ice.",
    price: 160,
    category: "Drinks",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop",
    available: true
  },
  {
    _id: "drink-2",
    name: "Cold Brew Caramel Iced Coffee",
    description: "Slow-steeped 18-hour artisan cold brew poured over milk ice cubes with a swirl of rich salted caramel.",
    price: 190,
    category: "Drinks",
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop",
    available: true
  },
  {
    _id: "drink-3",
    name: "Alphonso Mango Passion Smoothie",
    description: "Thick velvety blend of pure Ratnagiri Alphonso mango pulp, passionfruit, and Greek yogurt.",
    price: 210,
    category: "Drinks",
    image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&auto=format&fit=crop",
    available: true
  },
  {
    _id: "drink-4",
    name: "Hibiscus Lemon Berry Iced Tea",
    description: "Ruby-red brewed dried hibiscus blossoms infused with fresh lemon juice and wild berry nectar.",
    price: 150,
    category: "Drinks",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&auto=format&fit=crop",
    available: true
  }
];

module.exports = initialMenuItems;
