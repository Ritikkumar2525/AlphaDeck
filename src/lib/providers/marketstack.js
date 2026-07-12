import { httpClient } from '../httpClient';

export async function fetchMarketstackQuote(symbol) {
  const apiKey = process.env.MARKETSTACK_API_KEY;
  if (!apiKey) throw new Error('API_KEY_MISSING');
  const res = await httpClient.get(`http://api.marketstack.com/v1/tickers/${symbol}/eod/latest?access_key=${apiKey}`);
  const data = res.data;
  if (!data.data || !data.data.eod || data.data.eod.length === 0) throw new Error('NO_DATA');
  const eod = data.data.eod[0];
  return {
    currentPrice: eod.close,
    previousClose: eod.close,
    open: eod.open,
    high: eod.high,
    low: eod.low,
    volume: eod.volume
  };
}

export async function fetchMarketstackProfile(symbol) {
  const apiKey = process.env.MARKETSTACK_API_KEY;
  if (!apiKey) throw new Error('API_KEY_MISSING');
  const res = await httpClient.get(`http://api.marketstack.com/v1/tickers/${symbol}/eod/latest?access_key=${apiKey}`);
  const data = res.data;
  if (!data.data || !data.data.name) throw new Error('NO_DATA');
  return {
    companyName: data.data.name,
    exchange: data.data.stock_exchange?.acronym,
    sector: 'N/A',
    industry: 'N/A',
    website: 'N/A',
    description: 'N/A'
  };
}
