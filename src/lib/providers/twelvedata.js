import { httpClient } from '../httpClient';

export async function fetchTwelveDataQuote(symbol) {
  const apiKey = process.env.TWELVE_DATA_API_KEY;
  if (!apiKey) throw new Error('API_KEY_MISSING');
  const res = await httpClient.get(`https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${apiKey}`);
  const quote = res.data;
  if (quote.code === 429) throw new Error('RATE_LIMITED');
  if (quote.code || !quote.name) throw new Error('NO_DATA');
  return {
    currentPrice: parseFloat(quote.close),
    previousClose: parseFloat(quote.previous_close),
    open: parseFloat(quote.open),
    high: parseFloat(quote.high),
    low: parseFloat(quote.low),
    volume: parseInt(quote.volume, 10),
    fiftyTwoWeekHigh: parseFloat(quote.fifty_two_week?.high),
    fiftyTwoWeekLow: parseFloat(quote.fifty_two_week?.low),
  };
}

export async function fetchTwelveDataProfile(symbol) {
  const apiKey = process.env.TWELVE_DATA_API_KEY;
  if (!apiKey) throw new Error('API_KEY_MISSING');
  const res = await httpClient.get(`https://api.twelvedata.com/profile?symbol=${symbol}&apikey=${apiKey}`);
  const profile = res.data;
  if (profile.code === 429) throw new Error('RATE_LIMITED');
  if (profile.code || !profile.name) throw new Error('NO_DATA');
  return {
    companyName: profile.name,
    exchange: profile.exchange,
    sector: profile.sector || 'N/A',
    industry: profile.industry || 'N/A',
    website: profile.website || 'N/A',
    description: profile.description || 'N/A',
  };
}
