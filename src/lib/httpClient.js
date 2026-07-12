import axios from 'axios';
import { logger } from './logger';

// Create a shared Axios instance with default settings
export const httpClient = axios.create({
  timeout: 10000, // 10 seconds default timeout
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*'
  },
});

// Request Interceptor
httpClient.interceptors.request.use(
  (config) => {
    // You could add dynamic tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
httpClient.interceptors.response.use(
  (response) => {
    // Standard validation check
    if (response.data && response.data.error) {
      if (response.data.error.code === 'rate_limit_reached' || response.data.error === 'Rate limit exceeded') {
        const err = new Error('RATE_LIMITED');
        err.status = 429;
        return Promise.reject(err);
      }
    }
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 429) {
        return Promise.reject(new Error('RATE_LIMITED'));
      }
      return Promise.reject(new Error(`HTTP_${error.response.status}`));
    }
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return Promise.reject(new Error('TIMEOUT'));
    }
    return Promise.reject(new Error(`NETWORK_ERROR: ${error.message}`));
  }
);
