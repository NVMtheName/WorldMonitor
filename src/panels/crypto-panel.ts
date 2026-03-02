import type { CryptoQuote } from '../services/markets.js';

function formatPrice(price: number): string {
  if (price >= 1) return '$' + price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return '$' + price.toFixed(6);
}

function formatMarketCap(cap: number): string {
  if (cap >= 1e12) return '$' + (cap / 1e12).toFixed(2) + 'T';
  if (cap >= 1e9) return '$' + (cap / 1e9).toFixed(2) + 'B';
  if (cap >= 1e6) return '$' + (cap / 1e6).toFixed(2) + 'M';
  return '$' + cap.toLocaleString();
}

function escapeHtml(str: string): string {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

export function renderCryptoPanel(container: HTMLElement, coins: CryptoQuote[]): void {
  if (coins.length === 0) {
    container.innerHTML = `
      <div class="wm-empty">
        <div>₿</div>
        <div>Loading crypto data...</div>
        <div style="font-size: 10px; color: var(--text-muted);">Uses free CoinGecko API (no key needed)</div>
      </div>
    `;
    return;
  }

  container.innerHTML = coins
    .map(
      (c) => `
      <div class="wm-market-item">
        <div class="wm-market-symbol" style="display: flex; align-items: center; gap: 4px;">
          <img src="${escapeHtml(c.image)}" width="16" height="16" style="border-radius: 50%;" alt="" loading="lazy" />
          ${escapeHtml(c.symbol)}
        </div>
        <div class="wm-market-name">${escapeHtml(c.name)} · ${formatMarketCap(c.marketCap)}</div>
        <div class="wm-market-price">${formatPrice(c.price)}</div>
        <div class="wm-market-change ${c.change24h >= 0 ? 'wm-change-up' : 'wm-change-down'}">
          ${c.change24h >= 0 ? '+' : ''}${c.change24h.toFixed(2)}%
        </div>
      </div>
    `
    )
    .join('');
}

export function renderLoadingCrypto(container: HTMLElement): void {
  container.innerHTML = Array(8)
    .fill(0)
    .map(
      () => `
      <div style="display: flex; align-items: center; gap: 8px; padding: 5px 8px; border-bottom: 1px solid var(--border);">
        <div style="width: 16px; height: 16px; border-radius: 50%; background: var(--border);"></div>
        <div class="wm-skeleton-line" style="width: 40px; margin-bottom: 0;"></div>
        <div class="wm-skeleton-line" style="flex: 1; margin-bottom: 0;"></div>
        <div class="wm-skeleton-line" style="width: 60px; margin-bottom: 0;"></div>
      </div>
    `
    )
    .join('');
}
