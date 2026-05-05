const { fetchAndUpdatePrices } = require('../services/coinGeckoService');

const manualUpdate = async (req, res) => {
  try {
    await fetchAndUpdatePrices();
    res.json({ 
      status: 'success', 
      message: 'Prices updated successfully',
      timestamp: new Date() 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: error.message 
    });
  }
};

module.exports = { manualUpdate };