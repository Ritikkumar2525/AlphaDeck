const YahooFinance = require('yahoo-finance2').default;
const yf = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

export async function fetchYahooQuote(symbol) {
  const result = await yf.quoteSummary(symbol, { modules: ['price'] });
  if (!result || !result.price) throw new Error('NO_DATA');
  const price = result.price;
  return {
    currentPrice: price.regularMarketPrice ?? null,
    previousClose: price.regularMarketPreviousClose ?? null,
    open: price.regularMarketOpen ?? null,
    high: price.regularMarketDayHigh ?? null,
    low: price.regularMarketDayLow ?? null,
    volume: price.regularMarketVolume ?? null
  };
}

export async function fetchYahooProfile(symbol) {
  const result = await yf.quoteSummary(symbol, { modules: ['assetProfile', 'price'] });
  if (!result || !result.assetProfile) throw new Error('NO_DATA');
  const profile = result.assetProfile;
  const price = result.price || {};
  return {
    companyName: price.shortName || price.longName || symbol,
    exchange: price.exchangeName,
    sector: profile.sector || 'N/A',
    industry: profile.industry || 'N/A',
    website: profile.website || 'N/A',
    description: profile.longBusinessSummary || 'No description available.'
  };
}

export async function fetchYahooStatistics(symbol) {
  const result = await yf.quoteSummary(symbol, { modules: ['defaultKeyStatistics', 'financialData', 'price'] });
  if (!result || !result.defaultKeyStatistics) throw new Error('NO_DATA');
  const ks = result.defaultKeyStatistics;
  const fd = result.financialData || {};
  const price = result.price || {};
  return {
    marketCap: price.marketCap ?? null,
    peRatio: ks.trailingPE ?? ks.forwardPE ?? null,
    eps: ks.trailingEps ?? ks.forwardEps ?? null,
    beta: ks.beta ?? null,
    dividendYield: ks.dividendYield ?? null,
    fiftyTwoWeekHigh: fd.fiftyTwoWeekHigh ?? null,
    fiftyTwoWeekLow: fd.fiftyTwoWeekLow ?? null,
    forwardPE: ks.forwardPE ?? null,
    pegRatio: ks.pegRatio ?? null,
    priceToBook: ks.priceToBook ?? null,
    profitMargins: ks.profitMargins ?? fd.profitMargins ?? null,
    "52WeekChange": ks["52WeekChange"] ?? null,
    enterpriseValue: ks.enterpriseValue ?? null,
    shortRatio: ks.shortRatio ?? null,
    debtToEquity: fd.debtToEquity ?? null,
    currentRatio: fd.currentRatio ?? null,
    grossMargins: fd.grossMargins ?? null,
    operatingMargins: fd.operatingMargins ?? null,
    returnOnEquity: fd.returnOnEquity ?? null,
    freeCashflow: fd.freeCashflow ?? null
  };
}

export async function fetchYahooFinancials(symbol) {
  const result = await yf.quoteSummary(symbol, { 
    modules: ['incomeStatementHistory', 'balanceSheetHistory', 'cashflowStatementHistory'] 
  });
  return {
    income: result.incomeStatementHistory?.incomeStatementHistory || [],
    balance: result.balanceSheetHistory?.balanceSheetStatements || [],
    cashFlow: result.cashflowStatementHistory?.cashflowStatements || []
  };
}

export async function fetchYahooHistorical(symbol) {
  const result = await yf.chart(symbol, { period1: new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], interval: '1d' });
  if (!result || !result.quotes || result.quotes.length === 0) throw new Error('NO_DATA');
  return result.quotes.map(d => ({
    date: d.date instanceof Date ? d.date.toISOString().split('T')[0] : String(d.date),
    close: d.close,
    volume: d.volume
  }));
}

export async function fetchYahooOptions(symbol) {
  const result = await yf.options(symbol);
  if (!result || !result.options || result.options.length === 0) throw new Error('NO_DATA');
  const opt = result.options[0];
  const options = [];
  if (opt.calls) {
    options.push(...opt.calls.slice(0, 5).map(c => ({
      strike: c.strike,
      expiration: new Date(opt.expirationDate * 1000).toISOString().split('T')[0],
      type: 'CALL',
      impliedVolatility: c.impliedVolatility,
      openInterest: c.openInterest
    })));
  }
  if (opt.puts) {
    options.push(...opt.puts.slice(0, 5).map(p => ({
      strike: p.strike,
      expiration: new Date(opt.expirationDate * 1000).toISOString().split('T')[0],
      type: 'PUT',
      impliedVolatility: p.impliedVolatility,
      openInterest: p.openInterest
    })));
  }
  return options;
}

export async function fetchYahooHolders(symbol) {
  const result = await yf.quoteSummary(symbol, { modules: ['institutionOwnership'] });
  if (!result || !result.institutionOwnership || !result.institutionOwnership.ownershipList) throw new Error('NO_DATA');
  return result.institutionOwnership.ownershipList.map(h => ({
    name: h.organization,
    shares: h.position,
    percentage: h.pctHeld
  }));
}

export async function fetchYahooNews(symbol) {
  const result = await yf.search(symbol, { newsCount: 8 });
  if (!result || !result.news || result.news.length === 0) throw new Error('NO_DATA');
  return result.news.slice(0, 8).map(n => ({
    title: n.title,
    url: n.link,
    source: n.publisher,
    publishedAt: n.providerPublishTime,
    summary: n.type === 'STORY' ? 'Full story available on Yahoo Finance' : '',
    sentiment: 'neutral'
  }));
}
