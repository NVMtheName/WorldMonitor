import type { MarketQuote } from '../types/index.js';

function formatPrice(price: number): string {
  if (price === 0) return '—';
  if (price >= 1000) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return price.toFixed(2);
}

function formatChange(change: number, percent: number): string {
  if (change === 0 && percent === 0) return '—';
  const sign = change >= 0 ? '+' : '';
  return `${sign}${percent.toFixed(2)}%`;
}

function changeClass(change: number): string {
  if (change > 0) return 'wm-change-up';
  if (change < 0) return 'wm-change-down';
  return 'wm-change-flat';
}

function escapeHtml(str: string): string {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

export function renderMarketPanel(container: HTMLElement, quotes: MarketQuote[]): void {
  if (quotes.length === 0) {
    container.innerHTML = `
      <div class="wm-empty">
        <div>📈</div>
        <div>No market data available</div>
        <div style="font-size: 10px; color: var(--text-muted);">Add a Finnhub API key in Settings</div>
      </div>
    `;
    return;
  }

  container.innerHTML = quotes
    .map(
      (q) => `
      <div class="wm-market-item">
        <div class="wm-market-symbol">${escapeHtml(q.symbol)}</div>
        <div class="wm-market-name">${escapeHtml(q.name)}</div>
        <div class="wm-market-price">${formatPrice(q.price)}</div>
        <div class="wm-market-change ${changeClass(q.changePercent)}">
          ${formatChange(q.change, q.changePercent)}
        </div>
      </div>
    `
    )
    .join('');
}

export function renderLoadingMarket(container: HTMLElement): void {
  container.innerHTML = Array(8)
    .fill(0)
    .map(
      () => `
      <div style="display: flex; align-items: center; gap: 8px; padding: 5px 8px; border-bottom: 1px solid var(--border);">
        <div class="wm-skeleton-line" style="width: 50px; margin-bottom: 0;"></div>
        <div class="wm-skeleton-line" style="flex: 1; margin-bottom: 0;"></div>
        <div class="wm-skeleton-line" style="width: 60px; margin-bottom: 0;"></div>
      </div>
    `
    )
    .join('');
}
