const express = require('express');
const { 
  getAllCryptos, 
  getGainers, 
  getNewListings, 
  createCrypto 
} = require('../controllers/cryptoController');

const router = express.Router();

// Public routes (for assignment scope)
router.get('/', getAllCryptos);
router.get('/gainers', getGainers);
router.get('/new', getNewListings);

// Create crypto (in production, add admin middleware here)
router.post('/', createCrypto);

module.exports = router;