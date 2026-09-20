const mongoose = require('mongoose');

let isConnected = false;

/**
 * Connect to MongoDB database using Mongoose.
 * Uses MONGO_URI from .env or defaults to local MongoDB.
 * Gracefully handles cases where MongoDB server is not running.
 */
const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/travel-planner';

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000 // 3 seconds timeout
    });

    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isConnected = false;
    console.warn(`⚠️ MongoDB Connection Failed: ${error.message}`);
    console.log('⚡ Active in-memory fallback enabled! Trips and places will function seamlessly.');
    console.log('💡 Note: To persist data permanently, start local MongoDB or provide Atlas MONGO_URI in server/.env.');
    return false;
  }
};

const isMongoConnected = () => isConnected && mongoose.connection.readyState === 1;

module.exports = { connectDB, isMongoConnected };
