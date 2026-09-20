require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dns = require('dns');
const MenuItem = require('./models/MenuItem');
const User = require('./models/User');

// Force Node.js to use Google Public DNS in code to resolve SRV records
dns.setServers(['8.8.8.8', '8.8.4.4']);

const seedData = [
  // ──── STARTERS ────
  {
    name: "Crispy Paneer Tikka",
    description: "Marinated cottage cheese cubes chargrilled with bell peppers, onions, and aromatic tandoori spices.",
    price: 260,
    category: "Starters",
    image: "https://spicecravings.com/wp-content/uploads/2020/10/Paneer-Tikka-Featured-1.jpg",
    available: true
  },
  {
    name: "Loaded Peri-Peri Fries",
    description: "Golden crispy potato fries tossed in fiery African peri-peri dust, drizzled with spicy garlic mayo.",
    price: 180,
    category: "Starters",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVFXt46NGZCbs5q3lVeZwCdkUPQI13Mapx1rH1rQ3_Ywx1pSkT3rt7XhCl&s=10",
    available: true
  },
  {
    name: "Golden Cheese Corn Balls",
    description: "Crispy panko-crusted spheres stuffed with molten mozzarella cheese, sweet corn, and herbs.",
    price: 220,
    category: "Starters",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSxVTzdspKGL1Sg--Omv9RIOm9NpB8GDBYnAinOOYpsQ&s=10",
    available: true
  },
  {
    name: "Crispy Veg Spring Rolls",
    description: "Thin pastry sheets wrapped around shredded Asian vegetables and noodles, served with sweet chili sauce.",
    price: 210,
    category: "Starters",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTa5cTTNCJRrL11_9lYpJuI6lj_24FK1jY3gLyiO395eqcTECpaPAGWSw1P&s=10",
    available: true
  },
  {
    name: "Tandoori Stuffed Mushrooms",
    description: "Juicy whole button mushrooms filled with spiced paneer, roasted over charcoal.",
    price: 240,
    category: "Starters",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_TpTnT4A5lx_DGuv4Qg62KxSykRRCgxGJKXYOdWNpB1GzA88JZH8eQAWn&s=10",
    available: true
  },

  // ──── MAIN COURSE ────
  {
    name: "Paneer Butter Masala Royal Combo",
    description: "Rich and creamy cottage cheese cubes in silky tomato butter gravy, served with 2 butter garlic naans.",
    price: 360,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop",
    available: true
  },
  {
    name: "Creamy Truffle Penne Alfredo",
    description: "Al dente penne pasta bathed in a velvety parmesan cream sauce infused with white truffle essence.",
    price: 380,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=600&auto=format&fit=crop",
    available: true
  },
  {
    name: "Dal Makhani Grand Platter",
    description: "Slow-cooked black lentils simmered overnight with butter and fresh cream, served with jeera basmati rice.",
    price: 320,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop",
    available: true
  },
  {
    name: "Wood-Fired Margherita Pizza",
    description: "Handcrafted thin sourdough crust with San Marzano tomato sauce, fresh buffalo mozzarella, and basil leaves.",
    price: 420,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=600&auto=format&fit=crop",
    available: true
  },
  {
    name: "Smoky BBQ Gourmet Burger",
    description: "Charred plant-protein patty with caramelized balsamic onions, sharp cheddar, lettuce, and smoky barbecue glaze.",
    price: 290,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop",
    available: true
  },

  // ──── DESSERTS ────
  {
    name: "Death By Chocolate Sizzler",
    description: "Warm fudgy brownie topped with double dark chocolate scoops, molten hot fudge drizzle, and roasted cashews.",
    price: 250,
    category: "Desserts",
    image: "https://www.cookwithkushi.com/wp-content/uploads/2017/01/sizzling_brownie_ice_cream_sundae.jpg",
    available: true
  },
  {
    name: "Royal Gulab Jamun with Rabdi",
    description: "Golden fried milk dumplings soaked in saffron cardamom syrup, served on a bed of thick chilled rabdi.",
    price: 190,
    category: "Desserts",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYkvb6eEROwXjFu8XvJj5H77u1vR1qw9L78B6DyDJ57CPIHsyCqn7mu8pd&s=10",
    available: true
  },
  {
    name: "Belgian Chocolate Waffle",
    description: "Crispy freshly-baked golden waffle smothered in rich Belgian milk chocolate and dusted with powdered sugar.",
    price: 230,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=600&auto=format&fit=crop",
    available: true
  },
  {
    name: "Classic New York Cheesecake",
    description: "Velvety smooth cream cheese baked over a buttery graham cracker crust, topped with strawberry coulis.",
    price: 270,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&auto=format&fit=crop",
    available: true
  },

  // ──── DRINKS ────
  {
    name: "Classic Virgin Mojito",
    description: "Refreshing muddled fresh garden mint, zesty lime wedges, simple cane syrup, and sparkling fizz over crushed ice.",
    price: 160,
    category: "Drinks",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop",
    available: true
  },
  {
    name: "Cold Brew Caramel Iced Coffee",
    description: "Slow-steeped 18-hour artisan cold brew poured over milk ice cubes with a swirl of rich salted caramel.",
    price: 190,
    category: "Drinks",
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop",
    available: true
  },
  {
    name: "Alphonso Mango Passion Smoothie",
    description: "Thick velvety blend of pure Ratnagiri Alphonso mango pulp, passionfruit, and Greek yogurt.",
    price: 210,
    category: "Drinks",
    image: "https://cdn.uengage.io/uploads/31763/image-ZAL9A7-1775876721.png",
    available: true
  },
  {
    name: "Hibiscus Lemon Berry Iced Tea",
    description: "Ruby-red brewed dried hibiscus blossoms infused with fresh lemon juice and wild berry nectar.",
    price: 150,
    category: "Drinks",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&auto=format&fit=crop",
    available: true
  }
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb+srv://anaghaml1108_db_user:HHe5dGYYBE7p9ogv@recipe.iccjzvt.mongodb.net/restaurant_db?retryWrites=true&w=majority";

    console.log("Connecting to MongoDB Atlas via Google DNS...");
    await mongoose.connect(mongoUri);

    console.log("Clearing existing menu items and default owner...");
    await MenuItem.deleteMany({});
    
    // Insert initial dishes
    const createdItems = await MenuItem.insertMany(seedData);
    console.log(`✅ Successfully seeded ${createdItems.length} menu items across Starters, Main Course, Desserts, and Drinks!`);

    // Create or update default owner
    const existingOwner = await User.findOne({ email: 'owner@restaurant.com' });
    if (!existingOwner) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      await User.create({
        name: 'Restaurant Owner',
        email: 'owner@restaurant.com',
        password: hashedPassword,
        role: 'owner'
      });
      console.log('✅ Created default owner account:');
      console.log('   Email: owner@restaurant.com');
      console.log('   Password: password123');
    } else {
      console.log('ℹ️ Default owner account already exists (owner@restaurant.com)');
    }

    console.log('\n🎉 Database seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();