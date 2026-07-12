import { logger } from './logger';

class Cache {
  constructor() {
    this.store = new Map();
  }

  // Duration constants (in milliseconds)
  static TTL = {
    QUOTE: 30 * 1000,                  // 30 seconds
    TECHNICALS: 5 * 60 * 1000,         // 5 minutes
    NEWS: 15 * 60 * 1000,              // 15 minutes
    FINANCIALS: 12 * 60 * 60 * 1000,   // 12 hours
    AI_REPORT: 12 * 60 * 60 * 1000,    // 12 hours
    PROFILE: 24 * 60 * 60 * 1000,      // 24 hours
    HISTORICAL: 24 * 60 * 60 * 1000,   // 24 hours
  };

  get(key) {
    const item = this.store.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.store.delete(key);
      logger.info(`Cache miss (expired): ${key}`);
      return null;
    }

    logger.info(`Cache hit: ${key}`);
    return item.value;
  }

  set(key, value, ttlMs) {
    this.store.set(key, {
      value,
      expiry: Date.now() + ttlMs,
    });
    logger.info(`Cache set: ${key} (TTL: ${ttlMs / 1000}s)`);
  }

  delete(key) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }
}

export const cache = new Cache();
