const fallbackBaseUrl = 'http://localhost:3000';

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || fallbackBaseUrl).replace(/\/$/, '');

export const endpoints = {
  quote: `${API_BASE_URL}/quote`,
  quotes: `${API_BASE_URL}/quotes`,
  stats: `${API_BASE_URL}/stats`,
  metrics: `${API_BASE_URL}/metrics`,
  health: `${API_BASE_URL}/health`,
};
