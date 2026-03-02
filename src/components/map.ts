import L from 'leaflet';
import type { EarthquakeData, ConflictZone } from '../types/index.js';

let map: L.Map | null = null;
const markerLayers: Record<string, L.LayerGroup> = {};

const DARK_TILE = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

export function initMap(container: HTMLElement): L.Map {
  map = L.map(container, {
    center: [20, 0],
    zoom: 2,
    minZoom: 2,
    maxZoom: 12,
    zoomControl: true,
    attributionControl: true,
    worldCopyJump: true,
  });

  L.tileLayer(DARK_TILE, {
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/">OSM</a>',
    maxZoom: 19,
    subdomains: 'abcd',
  }).addTo(map);

  // Initialize layer groups
  markerLayers.earthquakes = L.layerGroup().addTo(map);
  markerLayers.conflicts = L.layerGroup().addTo(map);
  markerLayers.weather = L.layerGroup().addTo(map);

  return map;
}

export function updateEarthquakeMarkers(quakes: EarthquakeData[]): void {
  if (!markerLayers.earthquakes) return;
  markerLayers.earthquakes.clearLayers();

  quakes.forEach((q) => {
    const size = Math.max(6, Math.min(q.magnitude * 4, 30));
    let color = '#4488ff';
    if (q.magnitude >= 6) color = '#ff4444';
    else if (q.magnitude >= 5) color = '#ffaa00';

    const marker = L.circleMarker([q.lat, q.lng], {
      radius: size,
      fillColor: color,
      color: color,
      weight: 1,
      opacity: 0.8,
      fillOpacity: 0.35,
    });

    marker.bindPopup(`
      <div style="min-width: 160px;">
        <div style="font-weight: 600; font-size: 13px; margin-bottom: 4px;">
          M${q.magnitude.toFixed(1)} Earthquake
        </div>
        <div style="font-size: 11px; color: #ccc; margin-bottom: 2px;">${q.place}</div>
        <div style="font-size: 10px; color: #888;">
          Depth: ${q.depth.toFixed(1)} km<br/>
          ${new Date(q.time).toLocaleString()}<br/>
          ${q.tsunami ? '<span style="color: #ff4444;">⚠ Tsunami potential</span>' : ''}
        </div>
        <a href="${q.url}" target="_blank" rel="noopener" style="font-size: 10px; color: #00d4aa;">Details →</a>
      </div>
    `);

    // Pulse animation for recent quakes (last 6 hours)
    if (Date.now() - q.time < 6 * 60 * 60 * 1000) {
      const pulseMarker = L.circleMarker([q.lat, q.lng], {
        radius: size + 8,
        fillColor: color,
        color: color,
        weight: 1,
        opacity: 0.2,
        fillOpacity: 0.1,
        className: 'quake-pulse',
      });
      markerLayers.earthquakes!.addLayer(pulseMarker);
    }

    markerLayers.earthquakes!.addLayer(marker);
  });
}

export function updateConflictMarkers(conflicts: ConflictZone[]): void {
  if (!markerLayers.conflicts) return;
  markerLayers.conflicts.clearLayers();

  conflicts.forEach((c) => {
    const colors = {
      high: '#ff4444',
      medium: '#ffaa00',
      low: '#888888',
    };
    const sizes = { high: 20, medium: 15, low: 10 };
    const color = colors[c.intensity];
    const size = sizes[c.intensity];

    // Conflict zone circle
    const circle = L.circle([c.lat, c.lng], {
      radius: size * 15000,
      fillColor: color,
      color: color,
      weight: 1,
      opacity: 0.5,
      fillOpacity: 0.12,
    });

    circle.bindPopup(`
      <div style="min-width: 180px;">
        <div style="font-weight: 600; font-size: 13px; color: ${color}; margin-bottom: 4px;">
          ⚔ ${c.name}
        </div>
        <div style="font-size: 11px; color: #ccc; margin-bottom: 4px;">${c.description}</div>
        <div style="font-size: 10px; color: #888;">
          Intensity: <span style="color: ${color};">${c.intensity.toUpperCase()}</span><br/>
          Parties: ${c.parties.join(', ')}
        </div>
      </div>
    `);

    markerLayers.conflicts!.addLayer(circle);

    // Center marker
    const centerMarker = L.circleMarker([c.lat, c.lng], {
      radius: 4,
      fillColor: color,
      color: '#000',
      weight: 1,
      fillOpacity: 0.9,
    });
    markerLayers.conflicts!.addLayer(centerMarker);
  });
}

export function toggleLayer(layerName: string, visible: boolean): void {
  if (!map || !markerLayers[layerName]) return;
  if (visible) {
    map.addLayer(markerLayers[layerName]);
  } else {
    map.removeLayer(markerLayers[layerName]);
  }
}

export function getMap(): L.Map | null {
  return map;
}
