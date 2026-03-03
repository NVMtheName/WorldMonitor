export interface ApiKeys {
  newsapi: string;
  openweathermap: string;
  finnhub: string;
  exchangerate: string;
  polygonio: string;
  newsdata: string;
}

export interface NewsItem {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  imageUrl?: string;
  category?: string;
}

export interface EarthquakeData {
  id: string;
  magnitude: number;
  place: string;
  time: number;
  lat: number;
  lng: number;
  depth: number;
  url: string;
  tsunami: boolean;
}

export interface WeatherData {
  city: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  description: string;
  icon: string;
  windSpeed: number;
  country: string;
}

export interface MarketQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  high?: number;
  low?: number;
}

export interface CurrencyRate {
  code: string;
  name: string;
  rate: number;
  change?: number;
}

export interface VolcanoData {
  name: string;
  country: string;
  lat: number;
  lng: number;
  alertLevel: string;
  lastActivity: string;
}

export interface NuclearEvent {
  location: string;
  lat: number;
  lng: number;
  type: string;
  date: string;
  description: string;
}

export interface CyberThreat {
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  source: string;
  date: string;
  url: string;
  description: string;
}

export interface ConflictZone {
  name: string;
  lat: number;
  lng: number;
  intensity: 'high' | 'medium' | 'low';
  description: string;
  parties: string[];
}

export interface PanelConfig {
  id: string;
  title: string;
  icon: string;
  refreshInterval: number; // ms
  requiresApiKey?: keyof ApiKeys;
}
