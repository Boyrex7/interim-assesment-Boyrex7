require('dotenv').config();
const cron = require('node-cron');
const { fetchAndUpdatePrices } = require('./services/coinGeckoService');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Import routes
const authRoutes = require('./routes/authRoutes');
const cryptoRoutes = require('./routes/cryptoRoutes');

// Import utils
const connectDB = require('./config/db');
const ApiError = require('./utils/apiError');

const app = express();

// 🔧 TRUST PROXY: Required for Render
app.set('trust proxy', true);

// 🔒 Security middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173', 'https://boyrex7cryptoapp.netlify.app', 'https://*.netlify.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['set-cookie']
}));


// 📦 Body parsing middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// 🗄️ Connect to MongoDB
connectDB();

// 🔄 LIVE PRICE UPDATES: Fetch on startup + every 60 seconds
console.log('⏰ Initializing live price updates...');
fetchAndUpdatePrices(); // Run immediately on startup

cron.schedule('*/3 * * * *', () => {
  console.log('⏰ Running scheduled price update...');
  fetchAndUpdatePrices();
});
// 🛣️ Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/crypto', cryptoRoutes);

// 🏥 Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// ❌ 404 handler
app.all('*', (req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
});

// 🌍 Global error handler
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error:', err);
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message || 'Internal server error'
  });
});

// 🎧 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV}`);
});
