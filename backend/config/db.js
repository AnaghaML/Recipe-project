const mongoose = require('mongoose');
const dns = require('dns');

// Force Node.js to use Google Public DNS in code to resolve SRV records
dns.setServers(['8.8.8.8', '8.8.4.4']);

/**
 * Connect to MongoDB database using Mongoose.
 * Uses MONGO_URI from environment variables or defaults to Atlas URI.
 */
const connectDB = async () => {
  const atlasUri = "mongodb+srv://anaghaml1108_db_user:HHe5dGYYBE7p9ogv@recipe.iccjzvt.mongodb.net/restaurant_db?retryWrites=true&w=majority";
  const mongoUri = process.env.MONGO_URI || atlasUri;

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000 // 5-second timeout
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`⚠️ Could not connect to MongoDB at: ${mongoUri}`);
    console.warn(`   Reason: ${error.message}`);
    console.log('💡 Tip: Start MongoDB locally or set your Atlas MONGO_URI in backend/.env.');
    console.log('⚡ Running in active demo mode with initial memory store so frontend works right away!');
    return false;
  }
};

module.exports = connectDB;