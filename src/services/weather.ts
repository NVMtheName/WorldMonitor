import type { WeatherData } from '../types/index.js';
import { getApiKey } from './api-keys.js';

const OWM_API = 'https://api.openweathermap.org/data/2.5/weather';

const MAJOR_CITIES = [
  { name: 'New York', lat: 40.7128, lon: -74.006 },
  { name: 'London', lat: 51.5074, lon: -0.1278 },
  { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
  { name: 'Sydney', lat: -33.8688, lon: 151.2093 },
  { name: 'Dubai', lat: 25.2048, lon: 55.2708 },
  { name: 'São Paulo', lat: -23.5505, lon: -46.6333 },
  { name: 'Mumbai', lat: 19.076, lon: 72.8777 },
  { name: 'Paris', lat: 48.8566, lon: 2.3522 },
  { name: 'Singapore', lat: 1.3521, lon: 103.8198 },
  { name: 'Cairo', lat: 30.0444, lon: 31.2357 },
  { name: 'Moscow', lat: 55.7558, lon: 37.6173 },
  { name: 'Beijing', lat: 39.9042, lon: 116.4074 },
];

const WEATHER_ICONS: Record<string, string> = {
  '01d': '☀️', '01n': '🌙',
  '02d': '⛅', '02n': '☁️',
  '03d': '☁️', '03n': '☁️',
  '04d': '☁️', '04n': '☁️',
  '09d': '🌧️', '09n': '🌧️',
  '10d': '🌦️', '10n': '🌧️',
  '11d': '⛈️', '11n': '⛈️',
  '13d': '❄️', '13n': '❄️',
  '50d': '🌫️', '50n': '🌫️',
};

export async function fetchWeather(): Promise<WeatherData[]> {
  const apiKey = getApiKey('openweathermap');
  if (!apiKey) return [];

  const results: WeatherData[] = [];

  const batchSize = 4;
  for (let i = 0; i < MAJOR_CITIES.length; i += batchSize) {
    const batch = MAJOR_CITIES.slice(i, i + batchSize);
    const promises = batch.map(async (city) => {
      try {
        const res = await fetch(
          `${OWM_API}?lat=${city.lat}&lon=${city.lon}&appid=${apiKey}&units=metric`
        );
        if (!res.ok) return null;
        const data = await res.json();
        return {
          city: city.name,
          temp: Math.round(data.main.temp),
          feelsLike: Math.round(data.main.feels_like),
          humidity: data.main.humidity,
          description: data.weather[0]?.description || '',
          icon: WEATHER_ICONS[data.weather[0]?.icon] || '🌡️',
          windSpeed: data.wind?.speed || 0,
          country: data.sys?.country || '',
        } as WeatherData;
      } catch {
        return null;
      }
    });

    const batchResults = await Promise.all(promises);
    results.push(...batchResults.filter((r): r is WeatherData => r !== null));
  }

  return results;
}
