import type { MarketQuote } from '../types/index.js';
import { getApiKey } from './api-keys.js';

const FINNHUB_API = 'https://finnhub.io/api/v1';

const TRACKED_SYMBOLS = [
  { symbol: 'AAPL', name: 'Apple' },
  { symbol: 'MSFT', name: 'Microsoft' },
  { symbol: 'GOOGL', name: 'Alphabet' },
  { symbol: 'AMZN', name: 'Amazon' },
  { symbol: 'NVDA', name: 'NVIDIA' },
  { symbol: 'META', name: 'Meta' },
  { symbol: 'TSLA', name: 'Tesla' },
  { symbol: 'JPM', name: 'JPMorgan' },
  { symbol: 'V', name: 'Visa' },
  { symbol: 'BRK.B', name: 'Berkshire' },
];

const INDEX_SYMBOLS = [
  { symbol: '^GSPC', name: 'S&P 500', displaySymbol: 'SPX' },
  { symbol: '^DJI', name: 'Dow Jones', displaySymbol: 'DJI' },
  { symbol: '^IXIC', name: 'NASDAQ', displaySymbol: 'NDQ' },
  { symbol: '^FTSE', name: 'FTSE 100', displaySymbol: 'FTSE' },
  { symbol: '^N225', name: 'Nikkei 225', displaySymbol: 'NKY' },
];

export async function fetchMarketQuotes(): Promise<MarketQuote[]> {
  const apiKey = getApiKey('finnhub');
  if (!apiKey) return getFallbackQuotes();

  const quotes: MarketQuote[] = [];

  // Fetch stock quotes in batches
  for (const stock of TRACKED_SYMBOLS.slice(0, 10)) {
    try {
      const res = await fetch(
        `${FINNHUB_API}/quote?symbol=${stock.symbol}&token=${apiKey}`
      );
      if (!res.ok) continue;
      const data = await res.json();
      if (data.c && data.c > 0) {
        quotes.push({
          symbol: stock.symbol,
          name: stock.name,
          price: data.c,
          change: data.d || 0,
          changePercent: data.dp || 0,
          high: data.h,
          low: data.l,
        });
      }
    } catch {
      // skip individual failures
    }
  }

  if (quotes.length === 0) return getFallbackQuotes();
  return quotes;
}

export async function fetchIndices(): Promise<MarketQuote[]> {
  // Indices require different handling - use fallback data structure
  return INDEX_SYMBOLS.map((idx) => ({
    symbol: idx.displaySymbol,
    name: idx.name,
    price: 0,
    change: 0,
    changePercent: 0,
  }));
}

function getFallbackQuotes(): MarketQuote[] {
  // Show placeholder structure when no API key
  return TRACKED_SYMBOLS.map((s) => ({
    symbol: s.symbol,
    name: s.name,
    price: 0,
    change: 0,
    changePercent: 0,
  }));
}

// Crypto via free CoinGecko API (no key needed)
export interface CryptoQuote {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume: number;
  image: string;
}

export async function fetchCryptoQuotes(): Promise<CryptoQuote[]> {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=15&page=1&sparkline=false'
    );
    if (!res.ok) throw new Error(`CoinGecko error: ${res.status}`);
    const data = await res.json();

    return data.map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      price: coin.current_price,
      change24h: coin.price_change_percentage_24h || 0,
      marketCap: coin.market_cap,
      volume: coin.total_volume,
      image: coin.image,
    }));
  } catch {
    return [];
  }
}

// Currency rates via free API
export async function fetchCurrencyRates(): Promise<{ base: string; rates: Record<string, number>; timestamp: number }> {
  const apiKey = getApiKey('exchangerate');
  try {
    let url: string;
    if (apiKey) {
      url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;
    } else {
      // Free fallback
      url = 'https://open.er-api.com/v6/latest/USD';
    }
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Exchange rate error: ${res.status}`);
    const data = await res.json();
    return {
      base: 'USD',
      rates: data.rates || {},
      timestamp: data.time_last_update_unix || Date.now() / 1000,
    };
  } catch {
    return { base: 'USD', rates: {}, timestamp: Date.now() / 1000 };
  }
}
