import type { EarthquakeData } from '../types/index.js';

function timeAgo(timestamp: number): string {
  const ms = Date.now() - timestamp;
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function magClass(mag: number): string {
  if (mag >= 6) return 'high';
  if (mag >= 5) return 'moderate';
  return 'low';
}

function escapeHtml(str: string): string {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

export function renderEarthquakePanel(container: HTMLElement, quakes: EarthquakeData[]): void {
  if (quakes.length === 0) {
    container.innerHTML = `
      <div class="wm-empty">
        <div>🌍</div>
        <div>No recent earthquakes M4.5+</div>
      </div>
    `;
    return;
  }

  container.innerHTML = quakes
    .map(
      (q) => `
      <a href="${escapeHtml(q.url)}" target="_blank" rel="noopener" class="wm-quake-item" style="text-decoration: none; color: inherit;">
        <div class="wm-quake-mag ${magClass(q.magnitude)}">
          ${q.magnitude.toFixed(1)}
        </div>
        <div class="wm-quake-info">
          <div class="wm-quake-place">${escapeHtml(q.place)}</div>
          <div class="wm-quake-detail">
            ${q.depth.toFixed(0)}km deep · ${timeAgo(q.time)}
            ${q.tsunami ? ' · <span style="color: var(--danger);">⚠ Tsunami</span>' : ''}
          </div>
        </div>
      </a>
    `
    )
    .join('');
}

export function renderLoadingQuakes(container: HTMLElement): void {
  container.innerHTML = Array(6)
    .fill(0)
    .map(
      () => `
      <div style="display: flex; align-items: center; gap: 8px; padding: 5px 8px; border-bottom: 1px solid var(--border);">
        <div style="width: 36px; height: 36px; border-radius: 50%; background: var(--border);"></div>
        <div style="flex: 1;">
          <div class="wm-skeleton-line" style="width: 80%;"></div>
          <div class="wm-skeleton-line" style="width: 50%; height: 8px;"></div>
        </div>
      </div>
    `
    )
    .join('');
}
