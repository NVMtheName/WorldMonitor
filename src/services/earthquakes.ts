import type { EarthquakeData } from '../types/index.js';

const USGS_API = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary';

export async function fetchEarthquakes(period: '1h' | '1d' | '7d' = '1d', minMag: number = 4.5): Promise<EarthquakeData[]> {
  let url: string;
  if (period === '1h') {
    url = `${USGS_API}/all_hour.geojson`;
  } else if (period === '7d') {
    url = `${USGS_API}/4.5_week.geojson`;
  } else {
    url = `${USGS_API}/4.5_day.geojson`;
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error(`USGS API error: ${res.status}`);

  const data = await res.json();

  return data.features
    .filter((f: any) => f.properties.mag >= minMag)
    .map((f: any) => ({
      id: f.id,
      magnitude: f.properties.mag,
      place: f.properties.place || 'Unknown location',
      time: f.properties.time,
      lat: f.geometry.coordinates[1],
      lng: f.geometry.coordinates[0],
      depth: f.geometry.coordinates[2],
      url: f.properties.url,
      tsunami: f.properties.tsunami === 1,
    }))
    .sort((a: EarthquakeData, b: EarthquakeData) => b.time - a.time)
    .slice(0, 30);
}
