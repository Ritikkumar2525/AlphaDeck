import { httpClient } from '../httpClient';

export async function fetchTiingoQuote(symbol) {
  const apiKey = process.env.TIINGO_API_KEY;
  if (!apiKey) throw new Error('API_KEY_MISSING');
  const headers = { 'Authorization': `Token ${apiKey}` };
  const res = await httpClient.get(`https://api.tiingo.com/tiingo/daily/${symbol}/prices`, { headers });
  const quoteData = res.data;
  if (!quoteData || quoteData.length === 0) throw new Error('NO_DATA');
  const quote = quoteData[0];
  return {
    currentPrice: quote.close,
    previousClose: quote.close, 
    open: quote.open,
    high: quote.high,
    low: quote.low,
    volume: quote.volume
  };
}

export async function fetchTiingoProfile(symbol) {
  const apiKey = process.env.TIINGO_API_KEY;
  if (!apiKey) throw new Error('API_KEY_MISSING');
  const headers = { 'Authorization': `Token ${apiKey}` };
  const res = await httpClient.get(`https://api.tiingo.com/tiingo/daily/${symbol}`, { headers });
  const profileData = res.data;
  if (!profileData || !profileData.name) throw new Error('NO_DATA');
  return {
    companyName: profileData.name,
    exchange: profileData.exchangeCode,
    sector: 'N/A',
    industry: 'N/A',
    website: 'N/A',
    description: profileData.description || 'N/A'
  };
}
