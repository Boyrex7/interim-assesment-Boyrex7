const mongoose = require('mongoose');

const cryptoSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'], 
    trim: true 
  },
  symbol: { 
    type: String, 
    required: [true, 'Symbol is required'], 
    unique: true, 
    uppercase: true,
    trim: true 
  },
  price: { 
    type: Number, 
    required: [true, 'Price is required'], 
    min: [0, 'Price cannot be negative'] 
  },
  change24h: { 
    type: Number, 
    required: [true, '24h change is required'] 
  },
  image: { 
    type: String, 
    required: [true, 'Image URL is required'] 
  },
  marketCap: { 
    type: Number, 
    default: 0 
  },
  volume24h: { 
    type: Number, 
    default: 0 
  },
  listedAt: { 
    type: Date, 
    default: Date.now 
  }
}, { 
  timestamps: true 
});

// Indexes for efficient queries
cryptoSchema.index({ change24h: -1 }); // For /gainers endpoint
cryptoSchema.index({ listedAt: -1 });  // For /new endpoint

module.exports = mongoose.model('Crypto', cryptoSchema);