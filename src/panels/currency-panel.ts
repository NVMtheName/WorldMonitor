const DISPLAY_CURRENCIES = [
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'Mex$' },
  { code: 'KRW', name: 'Korean Won', symbol: '₩' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
];

export function renderCurrencyPanel(
  container: HTMLElement,
  rates: Record<string, number>,
  timestamp: number
): void {
  if (Object.keys(rates).length === 0) {
    container.innerHTML = `
      <div class="wm-empty">
        <div>💱</div>
        <div>No exchange rate data</div>
        <div style="font-size: 10px; color: var(--text-muted);">Uses free exchange rate API (no key needed)</div>
      </div>
    `;
    return;
  }

  const lastUpdate = timestamp > 0 ? new Date(timestamp * 1000).toLocaleString() : 'Unknown';

  container.innerHTML =
    `<div style="padding: 4px 8px; font-size: 9px; color: var(--text-muted); border-bottom: 1px solid var(--border);">
      Base: USD · Updated: ${lastUpdate}
    </div>` +
    DISPLAY_CURRENCIES.filter((c) => rates[c.code])
      .map(
        (c) => `
        <div class="wm-market-item">
          <div class="wm-market-symbol">${c.code}</div>
          <div class="wm-market-name">${c.symbol} ${c.name}</div>
          <div class="wm-market-price">${rates[c.code].toFixed(c.code === 'JPY' || c.code === 'KRW' ? 2 : 4)}</div>
        </div>
      `
      )
      .join('');
}

export function renderLoadingCurrency(container: HTMLElement): void {
  container.innerHTML = Array(8)
    .fill(0)
    .map(
      () => `
      <div style="display: flex; align-items: center; gap: 8px; padding: 5px 8px; border-bottom: 1px solid var(--border);">
        <div class="wm-skeleton-line" style="width: 40px; margin-bottom: 0;"></div>
        <div class="wm-skeleton-line" style="flex: 1; margin-bottom: 0;"></div>
        <div class="wm-skeleton-line" style="width: 60px; margin-bottom: 0;"></div>
      </div>
    `
    )
    .join('');
}
