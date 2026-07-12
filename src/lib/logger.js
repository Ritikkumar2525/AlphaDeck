export const logger = {
  info: (message, meta = {}) => {
    console.log(`[INFO] ${message}`, Object.keys(meta).length ? meta : '');
  },
  warn: (message, meta = {}) => {
    console.warn(`[WARN] ${message}`, Object.keys(meta).length ? meta : '');
  },
  error: (message, meta = {}) => {
    console.error(`[ERROR] ${message}`, Object.keys(meta).length ? meta : '');
  },
  api: (provider, endpoint, status, durationMs, meta = {}) => {
    console.log(`[API][${provider}] ${endpoint} | ${status} | ${durationMs}ms`, Object.keys(meta).length ? meta : '');
  },
  fallback: (fromProvider, toProvider, reason) => {
    console.warn(`[FALLBACK] Switching from ${fromProvider} to ${toProvider}. Reason: ${reason}`);
  }
};
