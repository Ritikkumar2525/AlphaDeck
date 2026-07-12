import { logger } from './logger';

class RateLimiter {
  constructor() {
    this.limits = new Map();
  }

  // Register a provider with its limits
  register(providerName, maxRequestsPerMinute, maxRequestsPerDay = Infinity) {
    this.limits.set(providerName, {
      maxRPM: maxRequestsPerMinute,
      maxRPD: maxRequestsPerDay,
      minuteCount: 0,
      dayCount: 0,
      minuteResetTime: Date.now() + 60000,
      dayResetTime: Date.now() + 86400000,
      isExhausted: false,
    });
  }

  // Check if a provider has capacity and consume a token
  consume(providerName) {
    const limit = this.limits.get(providerName);
    
    // If not registered, assume infinite capacity (e.g. Yahoo Finance)
    if (!limit) return true;

    const now = Date.now();

    // Reset minute counters if time passed
    if (now > limit.minuteResetTime) {
      limit.minuteCount = 0;
      limit.minuteResetTime = now + 60000;
      if (limit.isExhausted && limit.dayCount < limit.maxRPD) {
        limit.isExhausted = false; // Recovered from minute limit
      }
    }

    // Reset day counters if time passed
    if (now > limit.dayResetTime) {
      limit.dayCount = 0;
      limit.dayResetTime = now + 86400000;
      limit.isExhausted = false;
    }

    if (limit.isExhausted) {
      return false;
    }

    if (limit.minuteCount >= limit.maxRPM || limit.dayCount >= limit.maxRPD) {
      limit.isExhausted = true;
      logger.warn(`Rate limit exhausted for provider: ${providerName}`);
      return false;
    }

    limit.minuteCount++;
    limit.dayCount++;
    return true;
  }
  
  // Force mark a provider as exhausted (e.g., if we get a 429 response)
  markExhausted(providerName) {
    const limit = this.limits.get(providerName);
    if (limit) {
      limit.isExhausted = true;
      logger.warn(`Provider ${providerName} forcefully marked as exhausted (received 429)`);
    }
  }

  getStats(providerName) {
    return this.limits.get(providerName) || null;
  }
}

export const rateLimiter = new RateLimiter();

// Register the providers according to the prompt
rateLimiter.register('finnhub', 60, Infinity);          // 60 / minute
rateLimiter.register('twelvedata', Infinity, 800);      // 800 / day
rateLimiter.register('alphavantage', 5, 25);            // 5 / min, 25 / day
rateLimiter.register('polygon', 5, Infinity);           // Assumed standard free limit
rateLimiter.register('tiingo', Infinity, 50);           // Assumed standard free limit
rateLimiter.register('marketstack', Infinity, 100);     // Assumed standard free limit
rateLimiter.register('eodhd', Infinity, 20);            // Assumed standard free limit
