require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');

// Import routes
const tripRoutes = require('./routes/tripRoutes');
const placeRoutes = require('./routes/placeRoutes');

// Initialize Express App
const app = express();

// Connect to Database
connectDB();

// Global Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger for development
app.use((req, res, next) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Travel Trip Planner API',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/trips', tripRoutes);
app.use('/api/places', placeRoutes);

// Root route welcome
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Travel Trip Planner API',
    endpoints: {
      health: '/api/health',
      trips: '/api/trips',
      places: '/api/places'
    }
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    message: `Route ${req.originalUrl} not found`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🌍 Travel Trip Planner API Server running on: http://localhost:${PORT}`);
  console.log(`📍 Endpoints available:`);
  console.log(`   - Health: http://localhost:${PORT}/api/health`);
  console.log(`   - Trips:  http://localhost:${PORT}/api/trips`);
  console.log(`   - Places: http://localhost:${PORT}/api/places\n`);
});
