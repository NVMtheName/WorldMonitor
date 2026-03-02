import type { ApiKeys } from '../types/index.js';
import { loadApiKeys, saveApiKeys } from '../services/api-keys.js';

const API_KEY_FIELDS: {
  key: keyof ApiKeys;
  label: string;
  hint: string;
  url: string;
}[] = [
  {
    key: 'newsapi',
    label: 'NewsAPI Key',
    hint: 'Get a free key at newsapi.org',
    url: 'https://newsapi.org/register',
  },
  {
    key: 'newsdata',
    label: 'NewsData.io Key',
    hint: 'Alternative news source - newsdata.io',
    url: 'https://newsdata.io/register',
  },
  {
    key: 'openweathermap',
    label: 'OpenWeatherMap Key',
    hint: 'Free tier available - openweathermap.org',
    url: 'https://openweathermap.org/api',
  },
  {
    key: 'finnhub',
    label: 'Finnhub API Key',
    hint: 'Free stock market data - finnhub.io',
    url: 'https://finnhub.io/register',
  },
  {
    key: 'exchangerate',
    label: 'ExchangeRate API Key',
    hint: 'Optional - free fallback available - exchangerate-api.com',
    url: 'https://www.exchangerate-api.com/',
  },
  {
    key: 'polygonio',
    label: 'Polygon.io Key',
    hint: 'Optional - additional market data - polygon.io',
    url: 'https://polygon.io/dashboard/signup',
  },
];

export function showSettings(onSave: () => void): void {
  const keys = loadApiKeys();

  const overlay = document.createElement('div');
  overlay.className = 'wm-settings-overlay';

  overlay.innerHTML = `
    <div class="wm-settings">
      <div class="wm-settings-header">
        <div class="wm-settings-title">⚙ Settings — API Keys</div>
        <button class="wm-settings-close" id="wm-settings-close">×</button>
      </div>
      <div class="wm-settings-body">
        <div class="wm-settings-section">
          <h3>Data Source API Keys</h3>
          <p style="font-size: 11px; color: var(--text-muted); margin-bottom: 12px;">
            Enter your API keys to enable live data feeds. All keys are stored locally in your browser.
            Some panels work without keys (earthquakes, crypto, conflicts).
          </p>
          ${API_KEY_FIELDS.map(
            (field) => `
            <div class="wm-settings-field">
              <label class="wm-settings-label">
                ${field.label}
                ${keys[field.key] ? '<span style="color: var(--success);">✓</span>' : '<span style="color: var(--text-muted);">○</span>'}
              </label>
              <input
                type="password"
                class="wm-settings-input"
                id="wm-key-${field.key}"
                value="${escapeAttr(keys[field.key])}"
                placeholder="Enter your ${field.label}..."
                autocomplete="off"
              />
              <div class="wm-settings-hint">
                ${field.hint} —
                <a href="${field.url}" target="_blank" rel="noopener" style="color: var(--accent);">Get key →</a>
              </div>
            </div>
          `
          ).join('')}
        </div>

        <div class="wm-settings-section">
          <h3>Free Data Sources (No Key Required)</h3>
          <div style="font-size: 11px; color: var(--text-secondary); line-height: 1.8;">
            <div>✅ <strong>USGS Earthquakes</strong> — Real-time seismic data</div>
            <div>✅ <strong>CoinGecko</strong> — Cryptocurrency prices</div>
            <div>✅ <strong>Exchange Rates</strong> — Currency conversion (basic)</div>
            <div>✅ <strong>NVD/NIST</strong> — Cyber vulnerability data</div>
            <div>✅ <strong>RSS Feeds</strong> — News fallback (BBC, Reuters, etc.)</div>
            <div>✅ <strong>Conflict Zones</strong> — Curated conflict data</div>
          </div>
        </div>

        <button class="wm-settings-save" id="wm-settings-save">Save & Reload Data</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Close handlers
  const close = () => {
    overlay.remove();
  };

  overlay.querySelector('#wm-settings-close')!.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  // Save handler
  overlay.querySelector('#wm-settings-save')!.addEventListener('click', () => {
    const newKeys: Record<string, string> = {};
    for (const field of API_KEY_FIELDS) {
      const input = overlay.querySelector(`#wm-key-${field.key}`) as HTMLInputElement;
      newKeys[field.key] = input.value.trim();
    }
    saveApiKeys(newKeys as unknown as ApiKeys);
    close();
    onSave();
  });

  // Toggle password visibility on focus
  overlay.querySelectorAll('.wm-settings-input').forEach((input) => {
    input.addEventListener('focus', () => {
      (input as HTMLInputElement).type = 'text';
    });
    input.addEventListener('blur', () => {
      (input as HTMLInputElement).type = 'password';
    });
  });
}

function escapeAttr(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
