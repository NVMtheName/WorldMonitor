# World Monitor

Real-time global intelligence dashboard with live news, markets, earthquakes, weather, and more.

## Features

- **Interactive World Map** — Dark-themed Leaflet map with earthquake and conflict zone markers
- **Live News** — Aggregated from NewsAPI, NewsData.io, or RSS feeds (BBC, Reuters, Al Jazeera, NPR, AP)
- **Markets** — Real-time stock quotes via Finnhub API
- **Cryptocurrency** — Live prices from CoinGecko (no API key needed)
- **Earthquakes** — USGS real-time seismic data M4.5+ (no API key needed)
- **Weather** — Global city weather via OpenWeatherMap
- **Conflict Zones** — Curated active conflict tracker
- **Cyber Threats** — Recent CVEs from NIST NVD (no API key needed)
- **Exchange Rates** — Currency conversion data (free tier available)
- **Auto-Refresh** — All panels refresh on configurable intervals
- **API Key Management** — Enter your own keys via Settings UI, stored locally in browser

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173 and click **Settings** to enter your API keys.

## API Keys

All keys are optional. Many panels work without any keys:

| Service | Free? | Key Required? | Panel |
|---------|-------|---------------|-------|
| USGS Earthquakes | Yes | No | Earthquakes |
| CoinGecko | Yes | No | Crypto |
| NIST NVD | Yes | No | Cyber Threats |
| Exchange Rates (basic) | Yes | No | Currency |
| RSS Feeds | Yes | No | News (fallback) |
| Conflict Data | Yes | No | Conflicts |
| NewsAPI | Free tier | Optional | News |
| NewsData.io | Free tier | Optional | News |
| OpenWeatherMap | Free tier | Optional | Weather |
| Finnhub | Free tier | Optional | Markets |

## Tech Stack

- **Vite** + **TypeScript** — Fast dev server and build
- **Leaflet** — Open-source interactive map
- **Vanilla TS** — No framework dependency, pure TypeScript
- **DOMPurify** — HTML sanitization

## Build

```bash
npm run build    # Production build to dist/
npm run preview  # Preview production build
```

## License

MIT
