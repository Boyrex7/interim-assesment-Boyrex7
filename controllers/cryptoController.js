const Crypto = require('../models/Crypto');
const ApiError = require('../utils/apiError');

// @desc    Get all cryptocurrencies
// @route   GET /api/crypto
exports.getAllCryptos = async (req, res, next) => {
  try {
    const cryptos = await Crypto.find().sort({ name: 1 });
    
    res.json({
      status: 'success',
      results: cryptos.length,
      data: cryptos
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get top gainers (positive change24h)
// @route   GET /api/crypto/gainers
exports.getGainers = async (req, res, next) => {
  try {
    const gainers = await Crypto.find({ change24h: { $gt: 0 } })
      .sort({ change24h: -1 }) // Highest gainers first
      .limit(20);
    
    res.json({
      status: 'success',
      results: gainers.length,
      data: gainers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get new listings
// @route   GET /api/crypto/new
exports.getNewListings = async (req, res, next) => {
  try {
    const newCryptos = await Crypto.find()
      .sort({ listedAt: -1, createdAt: -1 }) // Newest first
      .limit(10);
    
    res.json({
      status: 'success',
      results: newCryptos.length,
      data: newCryptos
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new cryptocurrency (admin only for assignment)
// @route   POST /api/crypto
exports.createCrypto = async (req, res, next) => {
  try {
    const crypto = await Crypto.create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: crypto
    });
  } catch (error) {
    // Handle duplicate symbol error
    if (error.code === 11000) {
      return next(new ApiError(400, 'Cryptocurrency symbol already exists'));
    }
    next(error);
  }
};