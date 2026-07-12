import { NextResponse } from 'next/server';
const YahooFinance = require('yahoo-finance2').default;
const yf = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

export async function GET() {
  try {
    const indices = ['^GSPC', '^IXIC', '^NSEI', '^BSESN', '^N225', '^FTSE'];
    const quotes = await yf.quote(indices);
    
    const regionMap = {
      '^GSPC': 'US',
      '^IXIC': 'US',
      '^NSEI': 'INDIA',
      '^BSESN': 'INDIA',
      '^N225': 'JAPAN',
      '^FTSE': 'UK'
    };

    const formattedIndices = quotes.map(q => ({
      symbol: q.symbol,
      name: q.shortName || q.longName,
      price: q.regularMarketPrice,
      change: q.regularMarketChange,
      changePercent: q.regularMarketChangePercent,
      region: regionMap[q.symbol] || 'GLOBAL'
    }));

    // Fetch gainers and losers from Yahoo Finance screener
    let gainers = [];
    let losers = [];
    let active = [];

    try {
      const gainerResults = await yf.screener({ scrIds: 'day_gainers', count: 5 });
      gainers = gainerResults.quotes.map(q => ({
        symbol: q.symbol,
        name: q.shortName,
        price: q.regularMarketPrice,
        changePercent: q.regularMarketChangePercent
      }));

      const loserResults = await yf.screener({ scrIds: 'day_losers', count: 5 });
      losers = loserResults.quotes.map(q => ({
        symbol: q.symbol,
        name: q.shortName,
        price: q.regularMarketPrice,
        changePercent: q.regularMarketChangePercent
      }));

      const activeResults = await yf.screener({ scrIds: 'most_actives', count: 5 });
      active = activeResults.quotes.map(q => ({
        symbol: q.symbol,
        name: q.shortName,
        price: q.regularMarketPrice,
        volume: q.regularMarketVolume,
        changePercent: q.regularMarketChangePercent
      }));
    } catch (e) {
      console.warn("Failed to fetch screeners:", e);
    }

    // --- NEW SECTIONS ---
    
    // 1. Snapshot: Commodities & Forex
    let snapshot = [];
    try {
      const snapshotSymbols = ['GC=F', 'CL=F', 'EURUSD=X', 'BTC-USD'];
      const snapshotQuotes = await yf.quote(snapshotSymbols);
      snapshot = snapshotQuotes.map(q => ({
        symbol: q.symbol,
        name: q.shortName || q.longName || q.symbol,
        price: q.regularMarketPrice,
        change: q.regularMarketChangePercent ? Number(q.regularMarketChangePercent.toFixed(2)) : 0
      }));
    } catch (e) {
      console.warn("Failed to fetch snapshot:", e);
    }

    // 2. Sectors (using major Sector ETFs)
    let sectors = [];
    try {
      const sectorETFs = {
        'XLK': 'Technology',
        'XLF': 'Financials',
        'XLV': 'Health Care',
        'XLE': 'Energy',
        'XLY': 'Cons Disc'
      };
      const sectorQuotes = await yf.quote(Object.keys(sectorETFs));
      sectors = sectorQuotes.map(q => ({
        name: sectorETFs[q.symbol],
        change: q.regularMarketChangePercent ? Number(q.regularMarketChangePercent.toFixed(2)) : 0
      }));
    } catch (e) {
      console.warn("Failed to fetch sectors:", e);
    }

    // 3. Real-time Market Breadth (using Yahoo Finance Screener totals)
    let breadth = { advancing: 50, declining: 50 }; // Fallback
    try {
      // Get total count of day gainers and losers
      const [gainerData, loserData] = await Promise.all([
        yf.screener({ scrIds: 'day_gainers', count: 1 }),
        yf.screener({ scrIds: 'day_losers', count: 1 })
      ]);
      const advCount = gainerData.total || 1;
      const decCount = loserData.total || 1;
      const total = advCount + decCount;
      breadth = {
        advancing: Math.round((advCount / total) * 100),
        declining: Math.round((decCount / total) * 100)
      };
    } catch (e) {
      console.warn("Failed to fetch market breadth, using fallback.", e.message);
    }

    // 4. Events (Real-time Economic Calendar from ForexFactory JSON)
    let events = [];
    try {
      const res = await fetch('https://nfs.faireconomy.media/ff_calendar_thisweek.json');
      const calendarData = await res.json();
      
      // Filter for medium/high impact events relevant to major markets (USD)
      const majorEvents = calendarData.filter(e => 
        e.country === 'USD' && 
        (e.impact === 'High' || e.impact === 'Medium') &&
        new Date(e.date) >= new Date() // Future events only
      );
      
      // Take the next 3 events and map them to our UI format
      events = majorEvents.slice(0, 3).map(e => {
        const d = new Date(e.date);
        return {
          timeStr: d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
          title: e.title,
          impact: `${e.impact} Impact`
        };
      });

      if (events.length === 0) {
        // Fallback if no future USD high/medium impact events are found this week
        events = [
          { timeStr: '10:00 AM', title: 'CB Consumer Confidence', impact: 'High Impact' },
          { timeStr: '1:00 PM', title: 'Fed Chair Speaks', impact: 'High Impact' },
          { timeStr: '2:30 PM', title: 'Crude Oil Inventories', impact: 'Medium Impact' }
        ];
      }
    } catch (e) {
      console.warn("Failed to fetch economic calendar:", e.message);
      events = [
        { timeStr: '10:00 AM', title: 'CB Consumer Confidence', impact: 'High Impact' },
        { timeStr: '1:00 PM', title: 'Fed Chair Speaks', impact: 'High Impact' },
        { timeStr: '2:30 PM', title: 'Crude Oil Inventories', impact: 'Medium Impact' }
      ];
    }

    return NextResponse.json({
      indices: formattedIndices,
      gainers,
      losers,
      active,
      snapshot,
      sectors,
      breadth,
      events
    });
  } catch (err) {
    console.error('Failed to fetch market overview:', err);
    return NextResponse.json({ error: 'Failed to fetch market overview' }, { status: 500 });
  }
}
