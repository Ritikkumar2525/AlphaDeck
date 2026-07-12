import { NextResponse } from 'next/server';
const YahooFinance = require('yahoo-finance2').default;
const yf = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const symbolsParam = searchParams.get('symbols');

  if (!symbolsParam) {
    return NextResponse.json({ error: 'No symbols provided' }, { status: 400 });
  }

  const symbols = symbolsParam.split(',').map(s => s.trim()).filter(Boolean);

  if (symbols.length === 0) {
    return NextResponse.json({ error: 'No valid symbols provided' }, { status: 400 });
  }

  try {
    // Fetch quotes for all symbols
    const quotes = await yf.quote(symbols);
    
    // Normalize data
    const results = quotes.map(q => ({
      symbol: q.symbol,
      shortName: q.shortName || q.longName || q.symbol,
      price: q.regularMarketPrice,
      change: q.regularMarketChange,
      changePercent: q.regularMarketChangePercent,
      volume: q.regularMarketVolume,
      marketCap: q.marketCap,
    }));
    
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching watchlist data:', error);
    return NextResponse.json({ error: 'Failed to fetch watchlist data', details: error.message }, { status: 500 });
  }
}
