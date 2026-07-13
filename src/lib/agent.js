import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { getMarketData } from "./marketProvider";
import { AnalysisResultSchema } from "./types";
import { logger } from "./logger";
import { cache } from "./cache";

const SYSTEM_PROMPT = `You are an Institutional-Grade AI Investment Research Analyst, combining the expertise of a Wall Street Equity Research Analyst, CFA, Investment Banker, Hedge Fund Portfolio Manager, Venture Capital Analyst, and Financial Risk Analyst.

You will be provided with a comprehensive JSON object containing raw market data, financial statements, technical indicators, and news for a specific company.

Your objective is to perform a comprehensive, evidence-based investment analysis using this provided data and produce a professional investment research report.

The Final Answer MUST be a valid JSON object matching this structure exactly (do NOT include markdown code blocks or any extra text around the JSON):
{
  "decision": {
    "decision": "INVEST" | "HOLD" | "PASS", 
    "confidence": 85,
    "summary": "Detailed paragraph explaining the final verdict.",
    "strengths": ["Strength 1", "Strength 2", "Strength 3"],
    "risks": ["Risk 1", "Risk 2", "Risk 3"],
    "timeHorizon": "12-18 months",
    "priceTarget": "$120-$130",
    "reasoning": [
      { "category": "Revenue Growth", "assessment": "Assessment details", "sentiment": "bullish" },
      { "category": "Profitability", "assessment": "Assessment details", "sentiment": "bullish" },
      { "category": "Valuation", "assessment": "Assessment details", "sentiment": "neutral" }
    ],
    "executiveSummary": "...",
    "companyOverview": "...",
    "bullCase": "...",
    "bearCase": "...",
    "financialHealth": "...",
    "technicalAnalysis": "...",
    "valuation": "...",
    "growthPotential": "...",
    "competitiveAdvantages": ["...", "..."],
    "longTermOutlook": "...",
    "shortTermOutlook": "..."
  }
}

The 'decision.decision' MUST be exactly one of: 'INVEST', 'HOLD', or 'PASS'.
All number fields must be actual numbers (not strings).
Gather insights solely from the provided data, then return ONLY the JSON object containing the "decision" block.`;

// ---------------------------------------------------------
// AI Provider Configuration (Strict Priority Order)
// ---------------------------------------------------------
function getConfiguredAIProviders() {
  const providers = [];

  // Priority 1: Google Gemini (Fastest, largest context limit)
  if (process.env.GOOGLE_API_KEY) {
    providers.push({
      name: "Google Gemini",
      model: new ChatGoogleGenerativeAI({
        model: "gemini-1.5-flash",
        temperature: 0.1,
        maxRetries: 0,
        apiKey: process.env.GOOGLE_API_KEY,
      }),
    });
  }

  // Priority 1: OpenAI (Fastest, most reliable)
  if (process.env.OPENAI_API_KEY) {
    providers.push({
      name: "OpenAI",
      model: new ChatOpenAI({
        modelName: "gpt-4o-mini",
        temperature: 0.1,
        maxRetries: 0,
        apiKey: process.env.OPENAI_API_KEY,
      }),
    });
  }

  // Priority 2: OpenRouter
  if (process.env.OPENROUTER_API_KEY) {
    providers.push({
      name: "OpenRouter",
      model: new ChatOpenAI({
        modelName: "anthropic/claude-3-haiku",
        temperature: 0.1,
        maxRetries: 0,
        apiKey: process.env.OPENROUTER_API_KEY,
        configuration: { baseURL: "https://openrouter.ai/api/v1" },
      }),
    });
  }

  // Priority 3: Groq
  if (process.env.GROQ_API_KEY) {
    providers.push({
      name: "Groq",
      model: new ChatOpenAI({
        modelName: "llama-3.1-8b-instant",
        temperature: 0.1,
        maxRetries: 0,
        apiKey: process.env.GROQ_API_KEY,
        configuration: { baseURL: "https://api.groq.com/openai/v1" },
      }),
    });
  }

  // Priority 4: Cerebras
  if (process.env.CEREBRAS_API_KEY) {
    providers.push({
      name: "Cerebras",
      model: new ChatOpenAI({
        modelName: "llama3.1-8b", // Fixed 404 model
        temperature: 0.1,
        maxRetries: 0,
        apiKey: process.env.CEREBRAS_API_KEY,
        configuration: { baseURL: "https://api.cerebras.ai/v1" },
      }),
    });
  }

  // Priority 5: Mistral AI
  if (process.env.MISTRAL_API_KEY) {
    providers.push({
      name: "Mistral AI",
      model: new ChatOpenAI({
        modelName: "mistral-large-latest",
        temperature: 0.1,
        maxRetries: 0,
        apiKey: process.env.MISTRAL_API_KEY,
        configuration: { baseURL: "https://api.mistral.ai/v1" },
      }),
    });
  }

  // Priority 6: Fireworks AI
  if (process.env.FIREWORKS_API_KEY) {
    providers.push({
      name: "Fireworks AI",
      model: new ChatOpenAI({
        modelName: "accounts/fireworks/models/llama-v3-70b-instruct",
        temperature: 0.1,
        maxRetries: 0,
        apiKey: process.env.FIREWORKS_API_KEY,
        configuration: { baseURL: "https://api.fireworks.ai/inference/v1" },
      }),
    });
  }

  // Priority 7: DeepInfra
  if (process.env.DEEPINFRA_API_KEY) {
    providers.push({
      name: "DeepInfra",
      model: new ChatOpenAI({
        modelName: "meta-llama/Meta-Llama-3-70B-Instruct",
        temperature: 0.1,
        maxRetries: 0,
        apiKey: process.env.DEEPINFRA_API_KEY,
        configuration: { baseURL: "https://api.deepinfra.com/v1/openai" },
      }),
    });
  }

  return providers;
}

async function invokeAIWithFallback(prompt) {
  const providers = getConfiguredAIProviders();

  if (providers.length === 0) {
    throw new Error("MISSING_API_KEY: No AI providers are configured in .env.local.");
  }

  let lastError = null;

  for (let i = 0; i < providers.length; i++) {
    const provider = providers[i];
    try {
      logger.info(`AI: Attempting analysis using ${provider.name} (${i + 1}/${providers.length})`);
      
      const timeoutMs = 45000;
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("TIMEOUT: Provider took too long.")), timeoutMs);
      });

      const aiPromise = provider.model.invoke([{ role: "user", content: prompt }]);
      const result = await Promise.race([aiPromise, timeoutPromise]);

      logger.info(`AI: ✓ Successfully generated analysis via ${provider.name}`);
      
      // Ensure we always return a valid string to the parser
      if (!result || typeof result.content === 'undefined') {
        throw new Error("INVALID_RESPONSE: AI Provider returned empty content.");
      }
      
      // Some LangChain models return an array of objects for content. Normalize to string.
      if (Array.isArray(result.content)) {
        return result.content.map(block => block.text || "").join("");
      }

      return String(result.content);
    } catch (err) {
      const errMsg = err.message || String(err);
      lastError = errMsg;

      // Always fallback for any error (429, 401, 403, 5xx, timeout, network error)
      logger.warn(`AI: ${provider.name} failed (${errMsg.substring(0, 100)}...), falling back...`);
      
      if (i < providers.length - 1) {
        logger.fallback(provider.name, providers[i + 1].name, "Rate Limit, Timeout, or Unauthorized");
      }
      continue; 
    }
  }

  logger.error(`AI: All ${providers.length} AI providers failed. Last error: ${lastError}`);
  throw new Error("AI_ERROR: All configured AI providers are currently unavailable or rate-limited. Please try again later.");
}

function parseAIResponse(outputText) {
  if (!outputText) {
    throw new Error("AI_PARSE_ERROR: The AI returned an empty response.");
  }

  // Normalize formatting since models occasionally wrap JSON in markdown blocks
  let normalizedText = String(outputText).trim();
  if (normalizedText.startsWith("\`\`\`json")) {
    normalizedText = normalizedText.replace(/^\`\`\`json\s*\n?/, "").replace(/\n?\`\`\`\s*$/, "");
  } else if (normalizedText.startsWith("\`\`\`")) {
    normalizedText = normalizedText.replace(/^\`\`\`\s*\n?/, "").replace(/\n?\`\`\`\s*$/, "");
  }

  try {
    const parsed = JSON.parse(normalizedText);
    return parsed.decision || parsed;
  } catch (_) {
    // Aggressive JSON extraction fallback
    const jsonMatch = normalizedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed.decision || parsed;
      } catch (_) {
        // Fall through
      }
    }
  }
  
  throw new Error("AI_PARSE_ERROR: The AI did not return valid JSON.");
}

export async function analyzeCompany(companyQuery) {
  // 1. Sanitize input to prevent CacheKey crashes
  const sanitizedQuery = (companyQuery || "").toString().trim();
  if (!sanitizedQuery) {
    throw new Error("INVALID_TICKER: Empty query.");
  }

  // 2. Check AI report cache
  const aiCacheKey = `ai_report_${sanitizedQuery.toLowerCase().replace(/\s+/g, '_')}`;
  const cachedReport = cache.get(aiCacheKey);
  if (cachedReport) {
    logger.info(`AI report cache hit for: ${sanitizedQuery}`);
    return cachedReport;
  }

  // 3. Fetch all market data via the unified market data provider cascade 
  const marketData = await getMarketData(sanitizedQuery);

  // 4. Construct prompt with aggressively pruned data to prevent AI timeout
  const prunedData = {
    symbol: marketData.symbol,
    companyName: marketData.companyName,
    quote: marketData.quote,
    profile: marketData.profile,
    statistics: marketData.statistics,
    financials: marketData.financials,
    // Truncate massive arrays to save context window and speed up AI generation dramatically
    news: (marketData.news || []).slice(0, 3),
    historicalData: (marketData.historicalData || []).slice(-10),
    options: (marketData.options || []).slice(0, 5),
    holders: (marketData.holders || []).slice(0, 5),
  };
  const prompt = `${SYSTEM_PROMPT}\n\nRAW MARKET DATA TO ANALYZE:\n${JSON.stringify(prunedData, null, 2)}`;

  // 5. Invoke AI with multi-provider fallback
  const outputText = await invokeAIWithFallback(prompt);

  // 6. Parse the AI response robustly
  const parsedDecision = parseAIResponse(outputText);

  // 7. Build the final structured response
  const quote = marketData.quote || {};
  const profile = marketData.profile || {};
  const stats = marketData.statistics || {};
  
  const change = (quote.currentPrice || 0) - (quote.previousClose || quote.currentPrice || 0);
  const changePercent = quote.previousClose ? (change / quote.previousClose) * 100 : 0;

  const finalResponse = {
    company: {
      name: marketData.companyName || sanitizedQuery,
      ticker: marketData.symbol || "",
      sector: profile.sector || "N/A",
      industry: profile.industry || "N/A",
      description: profile.description || "No description available.",
    },
    stock: {
      currentPrice: quote.currentPrice || 0,
      change: change,
      changePercent: changePercent,
      marketCap: stats.marketCap || profile.marketCap || null,
      volume: quote.volume || null,
      weekHigh52: stats.fiftyTwoWeekHigh || quote.fiftyTwoWeekHigh || null,
      weekLow52: stats.fiftyTwoWeekLow || quote.fiftyTwoWeekLow || null,
      open: quote.open || null,
      previousClose: quote.previousClose || null,
    },
    financials: {
      eps: stats.eps || profile.eps || null,
      peRatio: stats.peRatio || profile.peRatio || null,
      debtToEquity: stats.debtToEquity || null,
      currentRatio: stats.currentRatio || null,
      grossMargin: stats.grossMargins ? stats.grossMargins * 100 : null,
      operatingMargin: stats.operatingMargins ? stats.operatingMargins * 100 : null,
      roe: stats.returnOnEquity ? stats.returnOnEquity * 100 : null,
      freeCashFlow: stats.freeCashflow || null,
      annualData: [],
    },
    news: (marketData.news || []).slice(0, 8).map(n => ({
      title: String(n.title || "Untitled News"),
      source: String(n.source || "Web"),
      url: String(n.url || "#"),
      publishedAt: n.publishedAt ? new Date(n.publishedAt).toISOString() : new Date().toISOString(),
      summary: String(n.summary || ""),
      sentiment: String(n.sentiment || "neutral")
    })),
    historicalData: marketData.historicalData || [],
    options: marketData.options || [],
    holders: marketData.holders || [],
    statistics: marketData.statistics || {},
    decision: parsedDecision,
  };

  // 8. Validate with Zod
  try {
    const validated = AnalysisResultSchema.parse(finalResponse);
    cache.set(aiCacheKey, validated, cache.constructor.TTL.AI_REPORT);
    return validated;
  } catch (zodError) {
    logger.error(`Zod Validation Error:`, zodError);
    logger.error(`Failed payload decision block:`, JSON.stringify(parsedDecision, null, 2));
    throw new Error("AI_PARSE_ERROR: The AI returned data that failed schema validation.");
  }
}
