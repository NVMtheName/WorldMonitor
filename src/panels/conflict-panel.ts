import type { ConflictZone } from '../types/index.js';

function escapeHtml(str: string): string {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

export function renderConflictPanel(container: HTMLElement, zones: ConflictZone[]): void {
  if (zones.length === 0) {
    container.innerHTML = `
      <div class="wm-empty">
        <div>⚔</div>
        <div>No conflict data</div>
      </div>
    `;
    return;
  }

  container.innerHTML = zones
    .map(
      (z) => `
      <div class="wm-threat-item">
        <div class="wm-threat-severity ${z.intensity === 'high' ? 'critical' : z.intensity}"></div>
        <div>
          <div class="wm-threat-title">⚔ ${escapeHtml(z.name)}</div>
          <div class="wm-threat-meta">${escapeHtml(z.description)}</div>
          <div class="wm-threat-meta" style="color: var(--text-muted); margin-top: 1px;">
            ${escapeHtml(z.parties.join(' vs '))} ·
            <span style="color: ${z.intensity === 'high' ? 'var(--danger)' : z.intensity === 'medium' ? 'var(--warning)' : 'var(--text-muted)'};">
              ${z.intensity.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    `
    )
    .join('');
}
