import { httpClient } from '../httpClient';

export async function fetchAlphaVantageQuote(symbol) {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  if (!apiKey) throw new Error('API_KEY_MISSING');
  const res = await httpClient.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`);
  const quoteData = res.data;
  if (quoteData.Note || quoteData.Information) throw new Error('RATE_LIMITED');
  const quote = quoteData['Global Quote'] || {};
  if (!quote['01. symbol']) throw new Error('NO_DATA');
  return {
    currentPrice: parseFloat(quote['05. price']),
    previousClose: parseFloat(quote['08. previous close']),
    open: parseFloat(quote['02. open']),
    high: parseFloat(quote['03. high']),
    low: parseFloat(quote['04. low']),
    volume: parseInt(quote['06. volume'], 10)
  };
}

export async function fetchAlphaVantageProfile(symbol) {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  if (!apiKey) throw new Error('API_KEY_MISSING');
  const res = await httpClient.get(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${apiKey}`);
  const profileData = res.data;
  if (profileData.Note || profileData.Information) throw new Error('RATE_LIMITED');
  if (!profileData.Name) throw new Error('NO_DATA');
  return {
    companyName: profileData.Name || symbol,
    exchange: profileData.Exchange,
    sector: profileData.Sector || 'N/A',
    industry: profileData.Industry || 'N/A',
    website: 'N/A',
    description: profileData.Description || 'N/A'
  };
}

export async function fetchAlphaVantageStatistics(symbol) {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  if (!apiKey) throw new Error('API_KEY_MISSING');
  const res = await httpClient.get(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${apiKey}`);
  const profileData = res.data;
  if (profileData.Note || profileData.Information) throw new Error('RATE_LIMITED');
  if (!profileData.Name) throw new Error('NO_DATA');
  return {
    marketCap: parseFloat(profileData.MarketCapitalization),
    peRatio: parseFloat(profileData.PERatio),
    eps: parseFloat(profileData.EPS),
    beta: parseFloat(profileData.Beta),
    dividendYield: parseFloat(profileData.DividendYield),
    fiftyTwoWeekHigh: parseFloat(profileData['52WeekHigh']),
    fiftyTwoWeekLow: parseFloat(profileData['52WeekLow'])
  };
}
