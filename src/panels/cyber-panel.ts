import type { CyberThreat } from '../types/index.js';

function escapeHtml(str: string): string {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function timeAgo(dateStr: string): string {
  const ms = Date.now() - new Date(dateStr).getTime();
  const hrs = Math.floor(ms / (60 * 60 * 1000));
  if (hrs < 1) return 'just now';
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function renderCyberPanel(container: HTMLElement, threats: CyberThreat[]): void {
  if (threats.length === 0) {
    container.innerHTML = `
      <div class="wm-empty">
        <div>🛡️</div>
        <div>No cyber threat data</div>
      </div>
    `;
    return;
  }

  container.innerHTML = threats
    .map(
      (t) => `
      <a href="${escapeHtml(t.url)}" target="_blank" rel="noopener" class="wm-threat-item" style="text-decoration: none; color: inherit;">
        <div class="wm-threat-severity ${t.severity}"></div>
        <div>
          <div class="wm-threat-title">${escapeHtml(t.title)}</div>
          <div class="wm-threat-meta">
            <span style="color: ${
              t.severity === 'critical'
                ? 'var(--danger)'
                : t.severity === 'high'
                ? 'var(--warning)'
                : t.severity === 'medium'
                ? 'var(--info)'
                : 'var(--text-muted)'
            };">${t.severity.toUpperCase()}</span>
            · ${escapeHtml(t.source)} · ${timeAgo(t.date)}
          </div>
        </div>
      </a>
    `
    )
    .join('');
}

export function renderLoadingCyber(container: HTMLElement): void {
  container.innerHTML = Array(5)
    .fill(0)
    .map(
      () => `
      <div style="display: flex; gap: 8px; padding: 6px 8px; border-bottom: 1px solid var(--border);">
        <div style="width: 4px; min-height: 32px; background: var(--border); border-radius: 2px;"></div>
        <div style="flex: 1;">
          <div class="wm-skeleton-line" style="width: 90%;"></div>
          <div class="wm-skeleton-line" style="width: 40%; height: 8px;"></div>
        </div>
      </div>
    `
    )
    .join('');
}
