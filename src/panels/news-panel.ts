import type { NewsItem } from '../types/index.js';

function timeAgo(dateStr: string): string {
  const ms = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function escapeHtml(str: string): string {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

export function renderNewsPanel(container: HTMLElement, news: NewsItem[]): void {
  if (news.length === 0) {
    container.innerHTML = `
      <div class="wm-empty">
        <div>📰</div>
        <div>No news data available</div>
        <div style="font-size: 10px; color: var(--text-muted);">
          Add a NewsAPI or NewsData.io key in Settings,<br/>or RSS feeds will be used as fallback.
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = news
    .map(
      (item) => `
      <a href="${escapeHtml(item.url)}" target="_blank" rel="noopener" class="wm-news-item">
        <div class="wm-news-title">${escapeHtml(item.title)}</div>
        <div class="wm-news-meta">
          <span class="wm-news-source">${escapeHtml(item.source)}</span>
          <span>${timeAgo(item.publishedAt)}</span>
          ${item.category ? `<span style="color: var(--purple);">${escapeHtml(item.category)}</span>` : ''}
        </div>
      </a>
    `
    )
    .join('');
}

export function renderLoadingNews(container: HTMLElement): void {
  container.innerHTML = Array(8)
    .fill(0)
    .map(
      (_, i) => `
      <div style="padding: 6px 8px; border-bottom: 1px solid var(--border);">
        <div class="wm-skeleton-line" style="width: ${75 + (i % 3) * 8}%;"></div>
        <div class="wm-skeleton-line" style="width: ${45 + (i % 4) * 10}%; height: 8px;"></div>
      </div>
    `
    )
    .join('');
}
