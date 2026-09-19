const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

let menuItems = [
  // --- SOUTH INDIAN ---
  {
    _id: "1",
    name: "Masala Dosa",
    category: "South Indian",
    price: 120,
    isVeg: true,
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop",
    description: "Crispy golden crepe filled with spiced potato masala, served with coconut chutney & sambar."
  },
  {
    _id: "2",
    name: "Mysore Masala Dosa",
    category: "South Indian",
    price: 140,
    isVeg: true,
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop",
    description: "Crispy dosa layered with spicy red garlic chutney and potato masala."
  },
  {
    _id: "3",
    name: "Idli Vada Combo",
    category: "South Indian",
    price: 110,
    isVeg: true,
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop",
    description: "Steamed soft rice cakes and crispy lentil vada served with hot sambar and chutney."
  },
  {
    _id: "4",
    name: "Ghee Podi Dosa",
    category: "South Indian",
    price: 150,
    isVeg: true,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop",
    description: "Golden dosa smeared with aromatic desi ghee and tossed in gun powder spices."
  },
  {
    _id: "5",
    name: "Onion Rava Dosa",
    category: "South Indian",
    price: 130,
    isVeg: true,
    image: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=500&auto=format&fit=crop",
    description: "Crispy net-textured semolina dosa sprinkled with chopped onions and green chilies."
  },
  {
    _id: "6",
    name: "Medu Vada (2 pcs)",
    category: "South Indian",
    price: 90,
    isVeg: true,
    image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=500&auto=format&fit=crop",
    description: "Deep-fried golden lentil donuts served with coconut chutney and piping hot sambar."
  },
  {
    _id: "7",
    name: "Uttapam",
    category: "South Indian",
    price: 120,
    isVeg: true,
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500&auto=format&fit=crop",
    description: "Thick savory rice pancake topped with fresh tomatoes, onions, and coriander."
  },

  // --- PASTAS ---
  {
    _id: "8",
    name: "Creamy Tomato Basil Penne",
    category: "Pastas",
    price: 340,
    isVeg: true,
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=500&auto=format&fit=crop",
    description: "Penne pasta tossed in a rich pink tomato cream sauce with fresh basil leaves."
  },
  {
    _id: "9",
    name: "Penne Alfredo",
    category: "Pastas",
    price: 360,
    isVeg: true,
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=500&auto=format&fit=crop",
    description: "Classic al dente penne in a rich, buttery parmesan garlic cream sauce."
  },
  {
    _id: "10",
    name: "Pesto Fusilli",
    category: "Pastas",
    price: 380,
    isVeg: true,
    image: "https://images.unsplash.com/photo-1621996346565-e3d5d6281363?w=500&auto=format&fit=crop",
    description: "Spiral fusilli tossed in fresh basil pesto, toasted pine nuts, and parmesan cheese."
  },
  {
    _id: "11",
    name: "Spaghetti Carbonara",
    category: "Pastas",
    price: 420,
    isVeg: false,
    image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500&auto=format&fit=crop",
    description: "Classic Italian spaghetti tossed with cured egg yolk, pecorino cheese, and black pepper."
  },
  {
    _id: "12",
    name: "Three-Cheese Lasagna",
    category: "Pastas",
    price: 440,
    isVeg: true,
    image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=500&auto=format&fit=crop",
    description: "Layered pasta sheets baked with marinara, mozzarella, ricotta, and parmesan cheese."
  },
  {
    _id: "13",
    name: "Spicy Arrabbiata",
    category: "Pastas",
    price: 320,
    isVeg: true,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop",
    description: "Penne pasta in a fiery San Marzano tomato sauce infused with chili flakes and garlic."
  },
  {
    _id: "14",
    name: "Spinach & Ricotta Ravioli",
    category: "Pastas",
    price: 410,
    isVeg: true,
    image: "https://images.unsplash.com/photo-1587740896339-96a761e0508d?w=500&auto=format&fit=crop",
    description: "Handmade pasta pockets filled with creamy ricotta and spinach, served in sage butter."
  },

  // --- CHAATS ---
  {
    _id: "15",
    name: "Pani Puri",
    category: "Chaats",
    price: 80,
    isVeg: true,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop",
    description: "Crispy hollow puris served with spicy mint-coriander water and potato chickpea filling."
  },
  {
    _id: "16",
    name: "Sev Puri",
    category: "Chaats",
    price: 90,
    isVeg: true,
    image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=500&auto=format&fit=crop",
    description: "Crispy papdis topped with diced potatoes, onions, spicy chutneys, and loaded nylon sev."
  },
  {
    _id: "17",
    name: "Dahi Puri",
    category: "Chaats",
    price: 110,
    isVeg: true,
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500&auto=format&fit=crop",
    description: "Crispy puris filled with potatoes, topped with sweetened chilled yogurt and tamarind chutney."
  },
  {
    _id: "18",
    name: "Samosa Chaat",
    category: "Chaats",
    price: 120,
    isVeg: true,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop",
    description: "Crushed potato samosas drenched in hot ragda, yogurt, tamarind chutney, and sev."
  },
  {
    _id: "19",
    name: "Masala Puri",
    category: "Chaats",
    price: 85,
    isVeg: true,
    image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=500&auto=format&fit=crop",
    description: "Crushed puris soaked in hot spiced green pea gravy, onions, and coriander."
  },
  {
    _id: "20",
    name: "Aloo Tikki Chaat",
    category: "Chaats",
    price: 110,
    isVeg: true,
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop",
    description: "Crispy shallow-fried potato patties served with spiced chickpea curry and sweet curd."
  },
  {
    _id: "21",
    name: "Papdi Chaat",
    category: "Chaats",
    price: 100,
    isVeg: true,
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500&auto=format&fit=crop",
    description: "Crunchy dough wafers topped with boiled potatoes, chickpeas, yogurt, and tangy chutney."
  },

  // --- DESSERTS & ICE CREAMS ---
  {
    _id: "22",
    name: "Artisanal Belgian Chocolate Ice Cream",
    category: "Desserts & Ice Creams",
    price: 160,
    isVeg: true,
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&auto=format&fit=crop",
    description: "Rich, velvety dark Belgian chocolate scoop made from cocoa beans."
  },
  {
    _id: "23",
    name: "Classic Tiramisu",
    category: "Desserts & Ice Creams",
    price: 280,
    isVeg: true,
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&auto=format&fit=crop",
    description: "Italian coffee-flavoured dessert layered with ladyfingers and mascarpone cream."
  },
  {
    _id: "24",
    name: "Warm Chocolate Brownie with Vanilla Ice Cream",
    category: "Desserts & Ice Creams",
    price: 220,
    isVeg: true,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop",
    description: "Gooey warm chocolate brownie served with a scoop of Madagascar vanilla bean ice cream."
  },
  {
    _id: "25",
    name: "Mango Sorbet",
    category: "Desserts & Ice Creams",
    price: 140,
    isVeg: true,
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&auto=format&fit=crop",
    description: "Refreshing dairy-free frozen sorbet crafted with pure Alphonso mango pulp."
  },
  {
    _id: "26",
    name: "Gulab Jamun with Ice Cream",
    category: "Desserts & Ice Creams",
    price: 150,
    isVeg: true,
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop",
    description: "Hot milk-solid dumplings soaked in rose syrup, paired with cold vanilla ice cream."
  },
  {
    _id: "27",
    name: "Pistachio Kulfi",
    category: "Desserts & Ice Creams",
    price: 120,
    isVeg: true,
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&auto=format&fit=crop",
    description: "Traditional dense Indian frozen dessert infused with cardamom and crushed pistachios."
  },
  {
    _id: "28",
    name: "Salted Caramel Ice Cream",
    category: "Desserts & Ice Creams",
    price: 160,
    isVeg: true,
    image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=500&auto=format&fit=crop",
    description: "Smooth cream blended with buttery caramel and sea salt flakes."
  },

  // --- BURGERS ---
  {
    _id: "29",
    name: "Veggie Crunch Burger",
    category: "Burgers",
    price: 220,
    isVeg: true,
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&auto=format&fit=crop",
    description: "Crispy vegetable patty with lettuce, tomatoes, and herb mayo in a toasted brioche bun."
  },
  {
    _id: "30",
    name: "Classic Gourmet Beef Burger",
    category: "Burgers",
    price: 380,
    isVeg: false,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop",
    description: "Juicy patty topped with melted cheddar, caramelized onions, and signature burger sauce."
  },
  {
    _id: "31",
    name: "Crispy Chicken Burger",
    category: "Burgers",
    price: 290,
    isVeg: false,
    image: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=500&auto=format&fit=crop",
    description: "Golden fried chicken breast fillet with spicy mayo, pickles, and crisp iceberg lettuce."
  },
  {
    _id: "32",
    name: "Spicy Paneer Burger",
    category: "Burgers",
    price: 260,
    isVeg: true,
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&auto=format&fit=crop",
    description: "Char-grilled spicy paneer slab coated with tandoori seasoning and mint chutney."
  },
  {
    _id: "33",
    name: "Smoky BBQ Bacon Burger",
    category: "Burgers",
    price: 420,
    isVeg: false,
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&auto=format&fit=crop",
    description: "Smash patty topped with smoked bacon strips, hickory BBQ sauce, and gouda cheese."
  },
  {
    _id: "34",
    name: "Grilled Avocado & Cheese Burger",
    category: "Burgers",
    price: 350,
    isVeg: true,
    image: "https://images.unsplash.com/photo-1521305916504-4a1121188589?w=500&auto=format&fit=crop",
    description: "Fresh sliced avocado, grilled halloumi cheese, roasted garlic aioli, and baby spinach."
  },
  {
    _id: "35",
    name: "Double Cheeseburger",
    category: "Burgers",
    price: 390,
    isVeg: false,
    image: "https://images.unsplash.com/photo-1534790566855-4cb788d389ec?w=500&auto=format&fit=crop",
    description: "Two stacked juicy beef patties layered with double American cheddar and pickles."
  },

  // --- PIZZA ---
  {
    _id: "36",
    name: "Margherita Supreme",
    category: "Pizza",
    price: 380,
    isVeg: true,
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500&auto=format&fit=crop",
    description: "Wood-fired pizza crust, San Marzano tomato sauce, fresh mozzarella balls, and basil."
  },
  {
    _id: "37",
    name: "Garden Veggie Delight",
    category: "Pizza",
    price: 440,
    isVeg: true,
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&auto=format&fit=crop",
    description: "Loaded with bell peppers, sweet corn, black olives, onions, and mushrooms."
  },
  {
    _id: "38",
    name: "Pepperoni Feast",
    category: "Pizza",
    price: 550,
    isVeg: false,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop",
    description: "Classic Italian pepperoni slices layered generously over melted mozzarella cheese."
  },
  {
    _id: "39",
    name: "BBQ Chicken & Red Onion",
    category: "Pizza",
    price: 490,
    isVeg: false,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop",
    description: "Smoky BBQ chicken chunks, sliced red onions, and cilantro on a mozzarella base."
  },
  {
    _id: "40",
    name: "Spicy Roasted Corn & Bell Pepper",
    category: "Pizza",
    price: 430,
    isVeg: true,
    image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=500&auto=format&fit=crop",
    description: "Fire-roasted corn, charred red bell peppers, jalapeños, and spicy tomato base."
  },
  {
    _id: "41",
    name: "Four Cheese (Quattro Formaggi)",
    category: "Pizza",
    price: 480,
    isVeg: true,
    image: "https://images.unsplash.com/photo-1573821663912-569905455b1c?w=500&auto=format&fit=crop",
    description: "Indulgent blend of Mozzarella, Gorgonzola, Parmesan, and Fontina cheeses."
  },
  {
    _id: "42",
    name: "Fiery Paneer Tikka",
    category: "Pizza",
    price: 460,
    isVeg: true,
    image: "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=500&auto=format&fit=crop",
    description: "Tandoori marinated paneer cubes, capsicum, onions, and red paprika."
  },

  // --- DRINKS ---
  {
    _id: "43",
    name: "Fresh Mint Lime Soda",
    category: "Drinks",
    price: 110,
    isVeg: true,
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop",
    description: "Refreshing crushed fresh mint leaves, lime juice, and sparkling soda."
  },
  {
    _id: "44",
    name: "Cold Brew Coffee",
    category: "Drinks",
    price: 180,
    isVeg: true,
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop",
    description: "Steeped for 18 hours, smooth dark espresso poured over ice blocks."
  },
  {
    _id: "45",
    name: "Iced Caramel Latte",
    category: "Drinks",
    price: 210,
    isVeg: true,
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&auto=format&fit=crop",
    description: "Rich espresso blended with cold milk and sweet buttery caramel drizzle."
  },
  {
    _id: "46",
    name: "Mango Passionfruit Smoothie",
    category: "Drinks",
    price: 220,
    isVeg: true,
    image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&auto=format&fit=crop",
    description: "Tropical blend of fresh Alphonso mango pulp and passionfruit juice."
  },
  {
    _id: "47",
    name: "Classic Virgin Mojito",
    category: "Drinks",
    price: 160,
    isVeg: true,
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop",
    description: "Muddled lime wedges, fresh mint leaves, sugar syrup, and soda over ice."
  },
  {
    _id: "48",
    name: "Hibiscus Iced Tea",
    category: "Drinks",
    price: 140,
    isVeg: true,
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop",
    description: "Chilled brewed dried hibiscus flowers with lemon juice and honey."
  },
  {
    _id: "49",
    name: "Berry Blast Milkshake",
    category: "Drinks",
    price: 230,
    isVeg: true,
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&auto=format&fit=crop",
    description: "Thick milkshake blended with fresh strawberries, blueberries, and vanilla ice cream."
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

app.get('/api/orders', (req, res) => res.json(orders));

app.listen(5000, () => console.log('Backend server running on http://localhost:5000'));