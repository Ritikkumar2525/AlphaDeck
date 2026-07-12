import { httpClient } from '../httpClient';

export async function fetchEODHDQuote(symbol) {
  const apiKey = process.env.EODHD_API_KEY;
  if (!apiKey) throw new Error('API_KEY_MISSING');
  const res = await httpClient.get(`https://eodhistoricaldata.com/api/real-time/${symbol}?api_token=${apiKey}&fmt=json`);
  const quote = res.data;
  if (!quote || quote.close === 'NA' || quote.close === undefined) throw new Error('NO_DATA');
  return {
    currentPrice: parseFloat(quote.close),
    previousClose: parseFloat(quote.previousClose),
    open: parseFloat(quote.open),
    high: parseFloat(quote.high),
    low: parseFloat(quote.low),
    volume: parseInt(quote.volume, 10)
  };
}

export async function fetchEODHDProfile(symbol) {
  const apiKey = process.env.EODHD_API_KEY;
  if (!apiKey) throw new Error('API_KEY_MISSING');
  const res = await httpClient.get(`https://eodhistoricaldata.com/api/fundamentals/${symbol}?api_token=${apiKey}&fmt=json`);
  const profile = res.data;
  if (!profile || !profile.General) throw new Error('NO_DATA');
  const gen = profile.General;
  return {
    companyName: gen.Name,
    exchange: gen.Exchange,
    sector: gen.Sector || 'N/A',
    industry: gen.Industry || 'N/A',
    website: gen.WebURL || 'N/A',
    description: gen.Description || 'N/A'
  };
}

export async function fetchEODHDStatistics(symbol) {
  const apiKey = process.env.EODHD_API_KEY;
  if (!apiKey) throw new Error('API_KEY_MISSING');
  const res = await httpClient.get(`https://eodhistoricaldata.com/api/fundamentals/${symbol}?api_token=${apiKey}&fmt=json`);
  const profile = res.data;
  if (!profile || !profile.Highlights) throw new Error('NO_DATA');
  const highlights = profile.Highlights;
  return {
    marketCap: parseFloat(highlights.MarketCapitalization),
    peRatio: parseFloat(highlights.PERatio),
    eps: parseFloat(highlights.EPSTTM),
    dividendYield: parseFloat(highlights.DividendYield)
  };
}
