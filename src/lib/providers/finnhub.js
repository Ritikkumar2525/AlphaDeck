import { httpClient } from '../httpClient';

export async function fetchFinnhubQuote(symbol) {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) throw new Error('API_KEY_MISSING');
  const res = await httpClient.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}`, { headers: { 'X-Finnhub-Token': apiKey }});
  if (res.data.d === null && res.data.c === 0) throw new Error('NO_DATA');
  return {
    currentPrice: res.data.c,
    previousClose: res.data.pc,
    open: res.data.o,
    high: res.data.h,
    low: res.data.l
  };
}

export async function fetchFinnhubProfile(symbol) {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) throw new Error('API_KEY_MISSING');
  const res = await httpClient.get(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}`, { headers: { 'X-Finnhub-Token': apiKey }});
  if (!res.data || Object.keys(res.data).length === 0) throw new Error('NO_DATA');
  return {
    companyName: res.data.name,
    exchange: res.data.exchange,
    sector: res.data.finnhubIndustry,
    industry: res.data.finnhubIndustry,
    website: res.data.weburl,
    description: `Sector: ${res.data.finnhubIndustry}` // Finnhub free doesn't have long desc
  };
}

export async function fetchFinnhubNews(symbol) {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) throw new Error('API_KEY_MISSING');
  const to = new Date().toISOString().split('T')[0];
  const from = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const res = await httpClient.get(`https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${from}&to=${to}`, { headers: { 'X-Finnhub-Token': apiKey }});
  if (!Array.isArray(res.data)) throw new Error('NO_DATA');
  return res.data.slice(0, 5).map(n => ({
    title: n.headline,
    url: n.url,
    source: n.source,
    summary: n.summary,
    publishedAt: new Date(n.datetime * 1000).toISOString()
  }));
}

export async function fetchFinnhubStatistics(symbol) {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) throw new Error('API_KEY_MISSING');
  const res = await httpClient.get(`https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&metric=all`, { headers: { 'X-Finnhub-Token': apiKey }});
  const m = res.data?.metric || {};
  if (Object.keys(m).length === 0) throw new Error('NO_DATA');
  return {
    marketCap: m.marketCapitalization || null,
    peRatio: m.peBasicExclExtraTTM || null,
    eps: m.epsBasicExclExtraItemsTTM || null,
    beta: m.beta || null,
    dividendYield: m.dividendYieldIndicatedAnnual || null,
    fiftyTwoWeekHigh: m['52WeekHigh'] || null,
    fiftyTwoWeekLow: m['52WeekLow'] || null,
    volume: m['10DayAverageTradingVolume'] || null
  };
}

export async function fetchFinnhubRecommendations(symbol) {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) throw new Error('API_KEY_MISSING');
  const res = await httpClient.get(`https://finnhub.io/api/v1/stock/recommendation?symbol=${symbol}`, { headers: { 'X-Finnhub-Token': apiKey }});
  if (!res.data || res.data.length === 0) throw new Error('NO_DATA');
  const r = res.data[0];
  return {
    strongBuy: r.strongBuy,
    buy: r.buy,
    hold: r.hold,
    sell: r.sell,
    strongSell: r.strongSell
  };
}

export async function fetchFinnhubHistorical(symbol) {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) throw new Error('API_KEY_MISSING');
  
  const to = Math.floor(Date.now() / 1000);
  const from = to - (365 * 24 * 60 * 60); // 1 year ago
  
  const res = await httpClient.get(`https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=${from}&to=${to}`, { 
    headers: { 'X-Finnhub-Token': apiKey }
  });
  
  if (res.data.s !== 'ok' || !res.data.t || res.data.t.length === 0) {
    throw new Error('NO_DATA');
  }
  
  // Finnhub returns arrays for each property: t (timestamp), c (close), v (volume)
  const historical = res.data.t.map((timestamp, index) => {
    return {
      date: new Date(timestamp * 1000).toISOString().split('T')[0],
      close: res.data.c[index],
      volume: res.data.v[index]
    };
  });
  
  return historical;
}
