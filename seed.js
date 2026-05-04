require('dotenv').config();
const connectDB = require('./config/db');
const Crypto = require('./models/Crypto');

connectDB();

const sampleCoins = [
  { 
    name: "Bitcoin", symbol: "BTC", price: 67240.20, change24h: 4.12, 
    image: "https://cryptologos.cc/logos/bitcoin-btc-logo.png", 
    marketCap: 1300000000000, volume24h: 25000000000 
  },
  { 
    name: "Ethereum", symbol: "ETH", price: 3420.81, change24h: 2.48, 
    image: "https://cryptologos.cc/logos/ethereum-eth-logo.png", 
    marketCap: 400000000000, volume24h: 15000000000 
  },
  { 
    name: "Solana", symbol: "SOL", price: 142.80, change24h: -0.84, 
    image: "https://cryptologos.cc/logos/solana-sol-logo.png", 
    marketCap: 60000000000, volume24h: 3000000000 
  },
  { 
    name: "XRP", symbol: "XRP", price: 0.62, change24h: 1.30, 
    image: "https://cryptologos.cc/logos/xrp-xrp-logo.png", 
    marketCap: 35000000000, volume24h: 1500000000 
  },
  { 
    name: "Dogecoin", symbol: "DOGE", price: 0.18, change24h: 9.72, 
    image: "https://cryptologos.cc/logos/dogecoin-doge-logo.png", 
    marketCap: 25000000000, volume24h: 2000000000 
  },
  { 
    name: "Cardano", symbol: "ADA", price: 0.45, change24h: -1.20, 
    image: "https://cryptologos.cc/logos/cardano-ada-logo.png", 
    marketCap: 15000000000, volume24h: 500000000 
  }
];

Crypto.insertMany(sampleCoins)
  .then(() => {
    console.log("✅ Database seeded with 6 coins!");
    process.exit();
  })
  .catch((err) => {
    console.error("❌ Seeding failed (coins might already exist):", err.message);
    process.exit();
  });