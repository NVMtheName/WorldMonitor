import './styles/global.css';
import { initMap, updateEarthquakeMarkers, updateConflictMarkers, toggleLayer } from './components/map.js';
import { showSettings } from './components/settings.js';
import { fetchEarthquakes } from './services/earthquakes.js';
import { fetchNews } from './services/news.js';
import { fetchWeather } from './services/weather.js';
import { fetchMarketQuotes, fetchCryptoQuotes, fetchCurrencyRates } from './services/markets.js';
import { fetchConflictZones } from './services/conflicts.js';
import { fetchCyberThreats } from './services/cyber.js';
import { renderNewsPanel, renderLoadingNews } from './panels/news-panel.js';
import { renderEarthquakePanel, renderLoadingQuakes } from './panels/earthquake-panel.js';
import { renderMarketPanel, renderLoadingMarket } from './panels/market-panel.js';
import { renderWeatherPanel, renderLoadingWeather } from './panels/weather-panel.js';
import { renderCryptoPanel, renderLoadingCrypto } from './panels/crypto-panel.js';
import { renderConflictPanel } from './panels/conflict-panel.js';
import { renderCyberPanel, renderLoadingCyber } from './panels/cyber-panel.js';
import { renderCurrencyPanel, renderLoadingCurrency } from './panels/currency-panel.js';
import type { EarthquakeData, NewsItem, WeatherData, MarketQuote, ConflictZone, CyberThreat } from './types/index.js';
import type { CryptoQuote } from './services/markets.js';

// ─── App State ────────────────────────────────────────────────
interface AppState {
  earthquakes: EarthquakeData[];
  news: NewsItem[];
  weather: WeatherData[];
  markets: MarketQuote[];
  crypto: CryptoQuote[];
  conflicts: ConflictZone[];
  cyberThreats: CyberThreat[];
  currencyRates: Record<string, number>;
  currencyTimestamp: number;
  counters: {
    earthquakes: number;
    news: number;
    conflicts: number;
    threats: number;
  };
  mapLayers: Record<string, boolean>;
  refreshTimers: number[];
}

const state: AppState = {
  earthquakes: [],
  news: [],
  weather: [],
  markets: [],
  crypto: [],
  conflicts: [],
  cyberThreats: [],
  currencyRates: {},
  currencyTimestamp: 0,
  counters: { earthquakes: 0, news: 0, conflicts: 0, threats: 0 },
  mapLayers: { earthquakes: true, conflicts: true },
  refreshTimers: [],
};

// ─── Clock ────────────────────────────────────────────────────
function updateClock(): void {
  const el = document.getElementById('wm-clock');
  if (el) {
    const now = new Date();
    el.textContent =
      now.toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }) + ' UTC' + (now.getTimezoneOffset() <= 0 ? '+' : '-') + Math.abs(now.getTimezoneOffset() / 60);
  }
}

// ─── Counters Bar ─────────────────────────────────────────────
function updateCounters(): void {
  const el = document.getElementById('wm-counters');
  if (!el) return;

  state.counters = {
    earthquakes: state.earthquakes.length,
    news: state.news.length,
    conflicts: state.conflicts.length,
    threats: state.cyberThreats.length,
  };

  el.innerHTML = `
    <div class="wm-counter">
      <span class="wm-counter-value">${state.counters.earthquakes}</span>
      <span class="wm-counter-label">Earthquakes (24h)</span>
    </div>
    <div class="wm-counter">
      <span class="wm-counter-value">${state.counters.news}</span>
      <span class="wm-counter-label">News Items</span>
    </div>
    <div class="wm-counter">
      <span class="wm-counter-value">${state.counters.conflicts}</span>
      <span class="wm-counter-label">Active Conflicts</span>
    </div>
    <div class="wm-counter">
      <span class="wm-counter-value">${state.counters.threats}</span>
      <span class="wm-counter-label">CVEs (72h)</span>
    </div>
    <div class="wm-counter">
      <span class="wm-counter-value">${state.crypto.length}</span>
      <span class="wm-counter-label">Crypto Tracked</span>
    </div>
    <div class="wm-counter">
      <span class="wm-counter-value">${state.weather.length}</span>
      <span class="wm-counter-label">Weather Cities</span>
    </div>
  `;
}

// ─── Data Loading ─────────────────────────────────────────────
async function loadEarthquakes(): Promise<void> {
  try {
    state.earthquakes = await fetchEarthquakes('1d', 4.5);
    renderEarthquakePanel(document.getElementById('panel-earthquakes-body')!, state.earthquakes);
    updateEarthquakeMarkers(state.earthquakes);
    updateCounters();
  } catch (e) {
    console.error('Earthquake fetch failed:', e);
  }
}

async function loadNews(): Promise<void> {
  try {
    state.news = await fetchNews();
    renderNewsPanel(document.getElementById('panel-news-body')!, state.news);
    updateCounters();
  } catch (e) {
    console.error('News fetch failed:', e);
  }
}

async function loadWeather(): Promise<void> {
  try {
    state.weather = await fetchWeather();
    renderWeatherPanel(document.getElementById('panel-weather-body')!, state.weather);
    updateCounters();
  } catch (e) {
    console.error('Weather fetch failed:', e);
  }
}

async function loadMarkets(): Promise<void> {
  try {
    state.markets = await fetchMarketQuotes();
    renderMarketPanel(document.getElementById('panel-markets-body')!, state.markets);
  } catch (e) {
    console.error('Markets fetch failed:', e);
  }
}

async function loadCrypto(): Promise<void> {
  try {
    state.crypto = await fetchCryptoQuotes();
    renderCryptoPanel(document.getElementById('panel-crypto-body')!, state.crypto);
    updateCounters();
  } catch (e) {
    console.error('Crypto fetch failed:', e);
  }
}

async function loadConflicts(): Promise<void> {
  try {
    state.conflicts = await fetchConflictZones();
    renderConflictPanel(document.getElementById('panel-conflicts-body')!, state.conflicts);
    updateConflictMarkers(state.conflicts);
    updateCounters();
  } catch (e) {
    console.error('Conflicts fetch failed:', e);
  }
}

async function loadCyber(): Promise<void> {
  try {
    state.cyberThreats = await fetchCyberThreats();
    renderCyberPanel(document.getElementById('panel-cyber-body')!, state.cyberThreats);
    updateCounters();
  } catch (e) {
    console.error('Cyber threats fetch failed:', e);
  }
}

async function loadCurrency(): Promise<void> {
  try {
    const data = await fetchCurrencyRates();
    state.currencyRates = data.rates;
    state.currencyTimestamp = data.timestamp;
    renderCurrencyPanel(document.getElementById('panel-currency-body')!, state.currencyRates, state.currencyTimestamp);
  } catch (e) {
    console.error('Currency fetch failed:', e);
  }
}

async function loadAllData(): Promise<void> {
  // Show loading states
  renderLoadingNews(document.getElementById('panel-news-body')!);
  renderLoadingQuakes(document.getElementById('panel-earthquakes-body')!);
  renderLoadingMarket(document.getElementById('panel-markets-body')!);
  renderLoadingWeather(document.getElementById('panel-weather-body')!);
  renderLoadingCrypto(document.getElementById('panel-crypto-body')!);
  renderLoadingCyber(document.getElementById('panel-cyber-body')!);
  renderLoadingCurrency(document.getElementById('panel-currency-body')!);

  // Load all in parallel
  await Promise.allSettled([
    loadEarthquakes(),
    loadNews(),
    loadWeather(),
    loadMarkets(),
    loadCrypto(),
    loadConflicts(),
    loadCyber(),
    loadCurrency(),
  ]);
}

// ─── Refresh System ───────────────────────────────────────────
function startRefreshTimers(): void {
  // Clear existing timers
  state.refreshTimers.forEach(clearInterval);
  state.refreshTimers = [];

  // Earthquakes: every 5 minutes
  state.refreshTimers.push(window.setInterval(loadEarthquakes, 5 * 60 * 1000));
  // News: every 10 minutes
  state.refreshTimers.push(window.setInterval(loadNews, 10 * 60 * 1000));
  // Markets: every 2 minutes
  state.refreshTimers.push(window.setInterval(loadMarkets, 2 * 60 * 1000));
  // Crypto: every 3 minutes
  state.refreshTimers.push(window.setInterval(loadCrypto, 3 * 60 * 1000));
  // Weather: every 15 minutes
  state.refreshTimers.push(window.setInterval(loadWeather, 15 * 60 * 1000));
  // Cyber: every 30 minutes
  state.refreshTimers.push(window.setInterval(loadCyber, 30 * 60 * 1000));
  // Currency: every 30 minutes
  state.refreshTimers.push(window.setInterval(loadCurrency, 30 * 60 * 1000));
  // Clock: every second
  state.refreshTimers.push(window.setInterval(updateClock, 1000));
}

// ─── Panel Creation Helpers ───────────────────────────────────
function createPanel(id: string, icon: string, title: string, badge?: string): string {
  return `
    <div class="wm-panel" id="panel-${id}">
      <div class="wm-panel-header">
        <div class="wm-panel-title">
          <span class="icon">${icon}</span>
          ${title}
        </div>
        ${badge ? `<div class="wm-panel-badge" style="background: var(--accent-dim); color: var(--accent);">${badge}</div>` : ''}
      </div>
      <div class="wm-panel-body" id="panel-${id}-body">
        <div class="wm-loading">
          <div class="wm-loading-spinner"></div>
          <div>Loading...</div>
        </div>
      </div>
    </div>
  `;
}

// ─── Layout ───────────────────────────────────────────────────
function renderLayout(): void {
  const app = document.getElementById('app')!;

  app.innerHTML = `
    <!-- Header -->
    <header class="wm-header">
      <div class="wm-header-left">
        <div class="wm-logo">WORLD <span>MONITOR</span></div>
        <div class="wm-status-dot"></div>
        <div class="wm-clock" id="wm-clock"></div>
      </div>
      <div class="wm-header-right">
        <button class="wm-header-btn" id="btn-layer-quakes" title="Toggle earthquake markers">
          🌍 Quakes
        </button>
        <button class="wm-header-btn" id="btn-layer-conflicts" title="Toggle conflict zones">
          ⚔ Conflicts
        </button>
        <button class="wm-header-btn" id="btn-refresh" title="Refresh all data">
          ↻ Refresh
        </button>
        <button class="wm-header-btn" id="btn-settings" title="Settings & API Keys">
          ⚙ Settings
        </button>
      </div>
    </header>

    <!-- Counters -->
    <div class="wm-counters" id="wm-counters"></div>

    <!-- Main content -->
    <div class="wm-main">
      <!-- Map -->
      <div class="wm-map-container">
        <div id="wm-map" style="width: 100%; height: 100%;"></div>
        <div class="wm-map-stats" id="wm-map-stats">
          <div class="wm-map-stat">
            <div class="dot" style="background: var(--info);"></div>
            <span>Earthquakes</span>
          </div>
          <div class="wm-map-stat">
            <div class="dot" style="background: var(--danger);"></div>
            <span>Conflict Zones</span>
          </div>
        </div>
      </div>

      <!-- Panel Grid -->
      <div class="wm-panels">
        ${createPanel('news', '📰', 'Live News', 'LIVE')}
        ${createPanel('markets', '📈', 'Markets')}
        ${createPanel('earthquakes', '🌍', 'Earthquakes', 'USGS')}
        ${createPanel('crypto', '₿', 'Crypto')}
        ${createPanel('weather', '🌤️', 'Weather')}
        ${createPanel('conflicts', '⚔', 'Active Conflicts')}
        ${createPanel('cyber', '🛡️', 'Cyber Threats', 'NVD')}
        ${createPanel('currency', '💱', 'Exchange Rates')}
      </div>
    </div>
  `;
}

// ─── Event Handlers ───────────────────────────────────────────
function setupEventHandlers(): void {
  // Settings
  document.getElementById('btn-settings')!.addEventListener('click', () => {
    showSettings(() => {
      loadAllData();
    });
  });

  // Refresh
  document.getElementById('btn-refresh')!.addEventListener('click', () => {
    loadAllData();
  });

  // Map layer toggles
  document.getElementById('btn-layer-quakes')!.addEventListener('click', (e) => {
    const btn = e.currentTarget as HTMLElement;
    state.mapLayers.earthquakes = !state.mapLayers.earthquakes;
    btn.classList.toggle('active', state.mapLayers.earthquakes);
    toggleLayer('earthquakes', state.mapLayers.earthquakes);
  });

  document.getElementById('btn-layer-conflicts')!.addEventListener('click', (e) => {
    const btn = e.currentTarget as HTMLElement;
    state.mapLayers.conflicts = !state.mapLayers.conflicts;
    btn.classList.toggle('active', state.mapLayers.conflicts);
    toggleLayer('conflicts', state.mapLayers.conflicts);
  });

  // Set initial active states
  document.getElementById('btn-layer-quakes')!.classList.add('active');
  document.getElementById('btn-layer-conflicts')!.classList.add('active');
}

// ─── Initialize ───────────────────────────────────────────────
async function init(): Promise<void> {
  renderLayout();
  updateClock();

  // Initialize map
  const mapContainer = document.getElementById('wm-map')!;
  initMap(mapContainer);

  // Setup handlers
  setupEventHandlers();

  // Load data
  await loadAllData();

  // Start auto-refresh
  startRefreshTimers();

  console.log('[World Monitor] Initialized');
}

// Boot
init().catch(console.error);
