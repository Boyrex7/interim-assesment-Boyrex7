const axios = require('axios');
const Crypto = require('../models/Crypto');

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

// Map our symbols to CoinGecko IDs
const coinGeckoIds = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  SOL: 'solana',
  XRP: 'ripple',
  DOGE: 'dogecoin',
  ADA: 'cardano',
  BNB: 'binancecoin',
  USDT: 'tether',
  USDC: 'usd-coin',
  MATIC: 'matic-network'
};

async function fetchAndUpdatePrices() {
  try {
    console.log('🔄 Fetching live prices from CoinGecko...');
    
    const ids = Object.values(coinGeckoIds).join(',');
    const response = await axios.get(`${COINGECKO_API}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        ids: ids,
        order: 'market_cap_desc',
        per_page: 100,
        page: 1,
        sparkline: true
      }
    });

    const coins = response.data;
    
    for (const coin of coins) {
      // Find our symbol from the CoinGecko ID
      const symbol = Object.keys(coinGeckoIds).find(
        key => coinGeckoIds[key] === coin.id
      );

      if (symbol) {
        await Crypto.findOneAndUpdate(
          { symbol: symbol },
          {
            name: coin.name,
            symbol: symbol.toUpperCase(),
            price: coin.current_price,
            change24h: coin.price_change_percentage_24h,
            marketCap: coin.market_cap,
            volume24h: coin.total_volume,
            image: coin.image
          },
          { upsert: true, new: true }
        );
      }
    }

    console.log(`✅ Updated ${coins.length} coins with live prices!`);
  } catch (error) {
    console.error('❌ Error fetching prices:', error.message);
  }
}

module.exports = { fetchAndUpdatePrices };