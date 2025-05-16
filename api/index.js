// api/index.js - Vercel serverless entry point
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

// Import routes
const flightRoutes = require('./routes/flights');
const packageRoutes = require('./routes/packages');
const cruiseRoutes = require('./routes/cruises');
const subscriptionRoutes = require('./routes/subscriptions');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Setup Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make supabase available to route handlers
app.use((req, res, next) => {
  req.supabase = supabase;
  next();
});

// Routes
app.use('/api/flights', flightRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/cruises', cruiseRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

// Home route
app.get('/', (req, res) => {
  res.send('JetSetters API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong on the server',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; 