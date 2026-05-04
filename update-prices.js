require('dotenv').config();
const connectDB = require('./config/db');
const Crypto = require('./models/Crypto');

connectDB();

Crypto.find().then(async (coins) => {
  for (const coin of coins) {
    // Random price change between -5% and +5%
    const changePercent = (Math.random() * 10 - 5) / 100;
    const newPrice = coin.price * (1 + changePercent);
    const newChange = coin.change24h + (Math.random() * 2 - 1);
    
    await Crypto.findByIdAndUpdate(coin._id, {
      price: parseFloat(newPrice.toFixed(2)),
      change24h: parseFloat(newChange.toFixed(2))
    });
  }
  console.log("✅ Prices updated!");
  process.exit();
});