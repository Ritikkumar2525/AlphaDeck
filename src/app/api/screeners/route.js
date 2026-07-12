import { NextResponse } from 'next/server';
const YahooFinance = require('yahoo-finance2').default;
const yf = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

// In-memory cache
let cache = {
  gainers: { data: null, timestamp: 0 },
  losers: { data: null, timestamp: 0 },
  active: { data: null, timestamp: 0 },
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'gainers'; // gainers, losers, active

  const validTypes = ['gainers', 'losers', 'active'];
  if (!validTypes.includes(type)) {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }

  // Check cache
  const now = Date.now();
  if (cache[type].data && now - cache[type].timestamp < CACHE_DURATION) {
    return NextResponse.json(cache[type].data);
  }

  try {
    let scrId;
    if (type === 'gainers') scrId = 'day_gainers';
    if (type === 'losers') scrId = 'day_losers';
    if (type === 'active') scrId = 'most_actives';

    // Fetch 20 symbols from the screener
    const screenerResults = await yf.screener({ scrIds: scrId, count: 20 });
    
    // Normalize data
    const results = screenerResults.quotes.map(q => ({
      symbol: q.symbol,
      shortName: q.shortName || q.longName,
      price: q.regularMarketPrice,
      change: q.regularMarketChange,
      changePercent: q.regularMarketChangePercent,
      volume: q.regularMarketVolume,
      marketCap: q.marketCap,
    })).filter(q => q.price); // Ensure we have a valid price

    // Update cache
    cache[type] = {
      data: results,
      timestamp: now
    };

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching screeners data:', error);
    return NextResponse.json({ error: 'Failed to fetch screeners data', details: error.message }, { status: 500 });
  }
}
