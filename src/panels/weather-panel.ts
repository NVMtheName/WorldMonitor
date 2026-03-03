import type { WeatherData } from '../types/index.js';

function escapeHtml(str: string): string {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

export function renderWeatherPanel(container: HTMLElement, data: WeatherData[]): void {
  if (data.length === 0) {
    container.innerHTML = `
      <div class="wm-empty">
        <div>🌤️</div>
        <div>No weather data available</div>
        <div style="font-size: 10px; color: var(--text-muted);">Add an OpenWeatherMap API key in Settings</div>
      </div>
    `;
    return;
  }

  container.innerHTML = data
    .map(
      (w) => `
      <div class="wm-weather-item">
        <div class="wm-weather-icon">${w.icon}</div>
        <div>
          <div class="wm-weather-city">${escapeHtml(w.city)}</div>
          <div class="wm-weather-desc">${escapeHtml(w.description)} · ${w.humidity}% · ${w.windSpeed.toFixed(1)}m/s</div>
        </div>
        <div class="wm-weather-temp">${w.temp}°C</div>
      </div>
    `
    )
    .join('');
}

export function renderLoadingWeather(container: HTMLElement): void {
  container.innerHTML = Array(6)
    .fill(0)
    .map(
      () => `
      <div style="display: flex; align-items: center; gap: 10px; padding: 6px 8px; border-bottom: 1px solid var(--border);">
        <div style="width: 36px; height: 36px; background: var(--border); border-radius: 4px;"></div>
        <div style="flex: 1;">
          <div class="wm-skeleton-line" style="width: 60%;"></div>
          <div class="wm-skeleton-line" style="width: 80%; height: 8px;"></div>
        </div>
        <div class="wm-skeleton-line" style="width: 40px; margin-bottom: 0;"></div>
      </div>
    `
    )
    .join('');
}
