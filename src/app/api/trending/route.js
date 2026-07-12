import { NextResponse } from 'next/server';
const YahooFinance = require('yahoo-finance2').default;
const yf = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region') || 'US';

    let symbolsToFetch = [];

    if (region === 'CRYPTO') {
      symbolsToFetch = ['BTC-USD', 'ETH-USD', 'SOL-USD', 'BNB-USD', 'XRP-USD', 'ADA-USD'];
    } else if (region === 'IN') {
      // Yahoo's trending API can be unreliable for 'IN'. Fallback to major NIFTY 50 stocks.
      symbolsToFetch = ['RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'INFY.NS', 'ICICIBANK.NS', 'SBIN.NS'];
    } else {
      // For US
      const result = await yf.trendingSymbols(region, { count: 6 });
      symbolsToFetch = result.quotes.map(q => q.symbol);
    }
    
    // Fetch quotes for the trending symbols to get price/change data
    const quotes = await yf.quote(symbolsToFetch);
    
    const formatted = quotes.map(q => ({
      symbol: q.symbol,
      name: q.shortName || q.longName || q.symbol,
      price: q.regularMarketPrice,
      change: q.regularMarketChange,
      changePercent: q.regularMarketChangePercent,
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    console.error('Failed to fetch trending symbols:', err);
    // Return a safe fallback rather than crashing the UI
    return NextResponse.json([
      { symbol: 'BTC-USD', name: 'Bitcoin USD', price: 64000, change: 100, changePercent: 0.15 },
      { symbol: 'AAPL', name: 'Apple Inc.', price: 180, change: 2.5, changePercent: 1.4 }
    ]);
  }
}
