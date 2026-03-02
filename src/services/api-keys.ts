import type { ApiKeys } from '../types/index.js';

const STORAGE_KEY = 'wm-api-keys';

const DEFAULT_KEYS: ApiKeys = {
  newsapi: '',
  openweathermap: '',
  finnhub: '',
  exchangerate: '',
  polygonio: '',
  newsdata: '',
};

export function loadApiKeys(): ApiKeys {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_KEYS, ...JSON.parse(stored) };
    }
  } catch { /* ignore */ }
  return { ...DEFAULT_KEYS };
}

export function saveApiKeys(keys: ApiKeys): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
}

export function hasApiKey(key: keyof ApiKeys): boolean {
  const keys = loadApiKeys();
  return keys[key].trim().length > 0;
}

export function getApiKey(key: keyof ApiKeys): string {
  return loadApiKeys()[key].trim();
}
