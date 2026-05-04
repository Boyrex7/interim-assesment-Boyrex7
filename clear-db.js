require('dotenv').config();
const connectDB = require('./config/db');
const Crypto = require('./models/Crypto');

connectDB();

Crypto.deleteMany({})
  .then(() => {
    console.log("✅ Database cleared!");
    process.exit();
  })
  .catch((err) => {
    console.error("❌ Error:", err.message);
    process.exit();
  });