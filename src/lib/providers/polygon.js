import { httpClient } from '../httpClient';

export async function fetchPolygonQuote(symbol) {
  const apiKey = process.env.POLYGON_API_KEY;
  if (!apiKey) throw new Error('API_KEY_MISSING');
  const res = await httpClient.get(`https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?apiKey=${apiKey}`);
  const quoteData = res.data;
  if (!quoteData.results || quoteData.results.length === 0) throw new Error('NO_DATA');
  const quote = quoteData.results[0];
  return {
    currentPrice: quote.c,
    previousClose: quote.c,
    open: quote.o,
    high: quote.h,
    low: quote.l,
    volume: quote.v
  };
}

export async function fetchPolygonProfile(symbol) {
  const apiKey = process.env.POLYGON_API_KEY;
  if (!apiKey) throw new Error('API_KEY_MISSING');
  const res = await httpClient.get(`https://api.polygon.io/v3/reference/tickers/${symbol}?apiKey=${apiKey}`);
  const profileData = res.data;
  if (!profileData.results) throw new Error('NO_DATA');
  const profile = profileData.results;
  return {
    companyName: profile.name,
    exchange: profile.primary_exchange,
    sector: profile.sic_description || 'N/A',
    industry: profile.sic_description || 'N/A',
    website: profile.homepage_url || 'N/A',
    description: profile.description || 'N/A',
    marketCap: profile.market_cap
  };
}

export async function fetchPolygonHistorical(symbol) {
  const apiKey = process.env.POLYGON_API_KEY;
  if (!apiKey) throw new Error('API_KEY_MISSING');
  
  const to = new Date().toISOString().split('T')[0];
  const from = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  const res = await httpClient.get(`https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${from}/${to}?apiKey=${apiKey}`);
  
  if (!res.data.results || res.data.results.length === 0) {
    throw new Error('NO_DATA');
  }
  
  const historical = res.data.results.map(d => ({
    date: new Date(d.t).toISOString().split('T')[0],
    close: d.c,
    volume: d.v
  }));
  
  return historical;
}
