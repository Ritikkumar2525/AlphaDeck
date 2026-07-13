import { z } from 'zod';

export const AnalysisResultSchema = z.object({
  company: z.object({
    name: z.string(),
    ticker: z.string(),
    sector: z.string(),
    industry: z.string(),
    description: z.string(),
  }),
  stock: z.object({
    currentPrice: z.number(),
    change: z.number(),
    changePercent: z.number(),
    marketCap: z.number().nullable(),
    volume: z.number().nullable(),
    weekHigh52: z.number().nullable(),
    weekLow52: z.number().nullable(),
    open: z.number().nullable(),
    previousClose: z.number().nullable(),
  }),
  financials: z.object({
    eps: z.number().nullable(),
    peRatio: z.number().nullable(),
    debtToEquity: z.number().nullable(),
    currentRatio: z.number().nullable(),
    grossMargin: z.number().nullable(),
    operatingMargin: z.number().nullable(),
    roe: z.number().nullable(),
    freeCashFlow: z.number().nullable(),
    annualData: z.array(z.object({
      year: z.number().nullable(),
      revenue: z.number().nullable(),
      netIncome: z.number().nullable(),
    })).optional(),
  }),
  news: z.array(z.object({
    title: z.string(),
    source: z.string().optional(),
    publishedAt: z.string().optional(),
    url: z.string().optional(),
    sentiment: z.string().optional(),
    summary: z.string().optional(),
  })).optional(),
  historicalData: z.array(z.object({
    date: z.string(),
    close: z.number().nullable().optional(),
    volume: z.number().nullable().optional()
  })).optional(),
  options: z.array(z.object({
    strike: z.number().nullable().optional(),
    expiration: z.string().nullable().optional(),
    type: z.string().nullable().optional(),
    impliedVolatility: z.number().nullable().optional(),
    openInterest: z.number().nullable().optional()
  })).optional(),
  holders: z.array(z.object({
    name: z.string(),
    shares: z.number().optional(),
    percentage: z.number().optional()
  })).optional(),
  statistics: z.record(z.any()).optional(),
  decision: z.object({
    // Core existing fields
    decision: z.enum(['INVEST', 'HOLD', 'PASS']),
    confidence: z.number(),
    summary: z.string(),
    strengths: z.array(z.string()).optional(),
    risks: z.array(z.string()).optional(),
    timeHorizon: z.string().optional(),
    priceTarget: z.string().optional(),
    reasoning: z.array(z.object({
      category: z.string(),
      assessment: z.string(),
      sentiment: z.string(),
    })).optional(),
    
    // New expanded AI fields from requirements
    executiveSummary: z.string().optional(),
    companyOverview: z.string().optional(),
    bullCase: z.string().optional(),
    bearCase: z.string().optional(),
    financialHealth: z.string().optional(),
    technicalAnalysis: z.string().optional(),
    valuation: z.string().optional(),
    growthPotential: z.string().optional(),
    competitiveAdvantages: z.array(z.string()).optional(),
    longTermOutlook: z.string().optional(),
    shortTermOutlook: z.string().optional(),
  }),
});
