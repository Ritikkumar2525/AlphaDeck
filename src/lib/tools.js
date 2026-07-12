const YahooFinance = require('yahoo-finance2').default;
const yf = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

/**
 * Resolve a company name or ticker to a valid Yahoo Finance ticker symbol.
 * E.g. "Apple" → "AAPL", "NVIDIA" → "NVDA", "IRFC" → "IRFC.NS"
 */
export async function resolveTickerSymbol(query) {
  try {
    const result = await yf.search(query, { quotesCount: 5, newsCount: 0 });
    const quotes = result.quotes || [];

    // Filter for equities only
    const equities = quotes.filter(q => q.quoteType === "EQUITY");
    if (equities.length === 0) return null;

    return {
      symbol: equities[0].symbol,
      name: equities[0].shortname || equities[0].longname || query,
      exchange: equities[0].exchange,
    };
  } catch (err) {
    console.error("Ticker resolution failed:", err.message);
    return null;
  }
}
