import { logger } from './logger';
import { rateLimiter } from './rateLimiter';

import * as finnhub from './providers/finnhub';
import * as twelvedata from './providers/twelvedata';
import * as polygon from './providers/polygon';
import * as tiingo from './providers/tiingo';
import * as alphavantage from './providers/alphavantage';
import * as eodhd from './providers/eodhd';
import * as marketstack from './providers/marketstack';
import * as yahoo from './providers/yahoo';

import { resolveTickerSymbol } from './tools';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function isNonRetryableError(msg) {
  return msg === 'API_KEY_MISSING' || msg === 'NO_DATA' || msg.startsWith('HTTP_401') || msg.startsWith('HTTP_403');
}

const PROVIDER_ORDER = [
  { name: 'finnhub', prefix: 'Finnhub', mod: finnhub },
  { name: 'twelvedata', prefix: 'TwelveData', mod: twelvedata },
  { name: 'polygon', prefix: 'Polygon', mod: polygon },
  { name: 'tiingo', prefix: 'Tiingo', mod: tiingo },
  { name: 'alphavantage', prefix: 'AlphaVantage', mod: alphavantage },
  { name: 'eodhd', prefix: 'EODHD', mod: eodhd },
  { name: 'marketstack', prefix: 'Marketstack', mod: marketstack },
  { name: 'yahoo', prefix: 'Yahoo', mod: yahoo }
];

async function fetchWithRetry(providerName, fn, symbol) {
  const maxRetries = 2;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const startTime = Date.now();
      const result = await fn(symbol);
      const duration = Date.now() - startTime;
      logger.api(providerName, `fetch(${symbol})`, 'SUCCESS', duration);
      return result;
    } catch (err) {
      const msg = err.message || '';
      if (msg === 'RATE_LIMITED' || msg === 'HTTP_429') rateLimiter.markExhausted(providerName);
      if (isNonRetryableError(msg)) throw err;
      if (attempt === maxRetries) throw err;
      await sleep(Math.pow(2, attempt) * 300);
    }
  }
}

async function fetchCascade(moduleName, symbol) {
  for (let i = 0; i < PROVIDER_ORDER.length; i++) {
    const provider = PROVIDER_ORDER[i];
    
    // e.g. fetchFinnhubQuote
    const functionName = `fetch${provider.prefix}${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}`;
    const fn = provider.mod[functionName];
    
    if (typeof fn !== 'function') continue; // Provider doesn't support this endpoint

    if (!rateLimiter.consume(provider.name)) continue; // Rate limited

    try {
      return await fetchWithRetry(provider.name, fn, symbol);
    } catch (err) {
      // Find the next provider that actually supports this module for the log message
      let nextName = 'none';
      for (let j = i + 1; j < PROVIDER_ORDER.length; j++) {
        const nextFnName = `fetch${PROVIDER_ORDER[j].prefix}${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}`;
        if (typeof PROVIDER_ORDER[j].mod[nextFnName] === 'function') {
           nextName = PROVIDER_ORDER[j].name;
           break;
        }
      }
      logger.fallback(provider.name, nextName, `${moduleName}: ${err.message}`);
    }
  }

  return null;
}

export async function getMarketData(ticker) {
  if (!ticker) throw new Error('Ticker is required');
  const resolution = await resolveTickerSymbol(ticker);
  const symbol = resolution && resolution.symbol ? resolution.symbol : ticker.toUpperCase();
  logger.info(`Fetching aggregated market data for: ${symbol}`);

  // Prefer Yahoo Finance for statistics since it provides the richest data (PE, PEG, Book, etc.)
  let statistics;
  try {
    statistics = await yahoo.fetchYahooStatistics(symbol);
  } catch (err) {
    logger.fallback('Yahoo', 'fetchCascade', `Statistics: ${err.message}`);
    statistics = await fetchCascade('statistics', symbol);
  }

  const [
    quote,
    profile,
    news,
    historicalData,
    financials,
    options,
    holders,
    recommendations
  ] = await Promise.all([
    fetchCascade('quote', symbol),
    fetchCascade('profile', symbol),
    fetchCascade('news', symbol),
    fetchCascade('historical', symbol),
    fetchCascade('financials', symbol),
    fetchCascade('options', symbol),
    fetchCascade('holders', symbol),
    fetchCascade('recommendations', symbol)
  ]);

  return {
    symbol,
    companyName: profile?.companyName || symbol,
    quote: quote || {},
    profile: profile || {},
    news: news || [],
    historicalData: historicalData || [],
    statistics: statistics || {},
    financials: financials || {},
    options: options || [],
    holders: holders || [],
    recommendations: recommendations || {}
  };
}
