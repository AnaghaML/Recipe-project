require('dotenv').config();
const mongoose = require('mongoose');
const Trip = require('./models/Trip');
const Place = require('./models/Place');
const { seedTrips, seedPlaces } = require('./data/seedData');

const seedDatabase = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/travel-planner';

  try {
    console.log(`Connecting to MongoDB at: ${mongoUri}...`);
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Connected to MongoDB');

    console.log('Clearing existing trips and places...');
    await Trip.deleteMany({});
    await Place.deleteMany({});

    console.log('Inserting seed trips...');
    const createdTrips = await Trip.insertMany(seedTrips);
    console.log(`✅ Inserted ${createdTrips.length} trips.`);

    console.log('Inserting seed places...');
    const createdPlaces = await Place.insertMany(seedPlaces);
    console.log(`✅ Inserted ${createdPlaces.length} places.`);

    console.log('\n🎉 Database successfully seeded with sample travel itineraries!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    console.log('\n💡 Note: If you do not have MongoDB running locally, the backend will automatically use the seed dataset in-memory when started!');
    process.exit(1);
  }
};

seedDatabase();
