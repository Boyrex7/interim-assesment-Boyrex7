const axios = require('axios');
const Crypto = require('../models/Crypto');

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

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
        sparkline: false // Remove sparkline to reduce payload
      },
      headers: {
        'Accept': 'application/json'
      }
    });

    const coins = response.data;
    console.log(`📊 Received ${coins.length} coins from CoinGecko`);
    
    for (const coin of coins) {
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
            change24h: coin.price_change_percentage_24h || 0,
            marketCap: coin.market_cap || 0,
            volume24h: coin.total_volume || 0,
            image: coin.image || ''
          },
          { upsert: true, new: true }
        );
      }
    }

    console.log(`✅ Updated ${coins.length} coins with live prices!`);
  } catch (error) {
    if (error.response && error.response.status === 429) {
      console.warn('⚠️  CoinGecko rate limit hit. Waiting before retry...');
      // Don't throw, just wait for next cron job
    } else {
      console.error('❌ Error fetching prices:', error.message);
    }
  }
}

module.exports = { fetchAndUpdatePrices };