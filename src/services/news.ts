import type { NewsItem } from '../types/index.js';
import { getApiKey } from './api-keys.js';

const NEWSAPI_URL = 'https://newsapi.org/v2/top-headlines';
const NEWSDATA_URL = 'https://newsdata.io/api/1/latest';

// Free RSS-to-JSON services as fallback
const RSS_FEEDS = [
  { name: 'Reuters', url: 'https://api.rss2json.com/v1/api.json?rss_url=https://feeds.reuters.com/reuters/topNews' },
  { name: 'BBC', url: 'https://api.rss2json.com/v1/api.json?rss_url=https://feeds.bbci.co.uk/news/world/rss.xml' },
  { name: 'Al Jazeera', url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.aljazeera.com/xml/rss/all.xml' },
  { name: 'NPR', url: 'https://api.rss2json.com/v1/api.json?rss_url=https://feeds.npr.org/1001/rss.xml' },
  { name: 'AP News', url: 'https://api.rss2json.com/v1/api.json?rss_url=https://rsshub.app/apnews/topics/apf-topnews' },
];

export async function fetchNews(): Promise<NewsItem[]> {
  // Try NewsAPI first
  const newsapiKey = getApiKey('newsapi');
  if (newsapiKey) {
    try {
      return await fetchFromNewsAPI(newsapiKey);
    } catch {
      // fallback to other sources
    }
  }

  // Try NewsData.io
  const newsdataKey = getApiKey('newsdata');
  if (newsdataKey) {
    try {
      return await fetchFromNewsData(newsdataKey);
    } catch {
      // fallback to RSS
    }
  }

  // Fallback: RSS feeds
  return fetchFromRSS();
}

async function fetchFromNewsAPI(apiKey: string): Promise<NewsItem[]> {
  const res = await fetch(`${NEWSAPI_URL}?language=en&pageSize=40&apiKey=${apiKey}`);
  if (!res.ok) throw new Error(`NewsAPI error: ${res.status}`);
  const data = await res.json();

  return (data.articles || []).map((a: any) => ({
    title: a.title || '',
    description: a.description || '',
    url: a.url || '',
    source: a.source?.name || 'Unknown',
    publishedAt: a.publishedAt || new Date().toISOString(),
    imageUrl: a.urlToImage || undefined,
  }));
}

async function fetchFromNewsData(apiKey: string): Promise<NewsItem[]> {
  const res = await fetch(`${NEWSDATA_URL}?apikey=${apiKey}&language=en&size=30`);
  if (!res.ok) throw new Error(`NewsData error: ${res.status}`);
  const data = await res.json();

  return (data.results || []).map((a: any) => ({
    title: a.title || '',
    description: a.description || '',
    url: a.link || '',
    source: a.source_name || a.source_id || 'Unknown',
    publishedAt: a.pubDate || new Date().toISOString(),
    imageUrl: a.image_url || undefined,
    category: a.category?.[0] || undefined,
  }));
}

async function fetchFromRSS(): Promise<NewsItem[]> {
  const allItems: NewsItem[] = [];

  const promises = RSS_FEEDS.map(async (feed) => {
    try {
      const res = await fetch(feed.url);
      if (!res.ok) return [];
      const data = await res.json();
      return (data.items || []).map((item: any) => ({
        title: item.title || '',
        description: item.description?.replace(/<[^>]*>/g, '').slice(0, 200) || '',
        url: item.link || '',
        source: feed.name,
        publishedAt: item.pubDate || new Date().toISOString(),
        imageUrl: item.thumbnail || item.enclosure?.link || undefined,
      }));
    } catch {
      return [];
    }
  });

  const results = await Promise.all(promises);
  for (const items of results) {
    allItems.push(...items);
  }

  // Sort by date, newest first
  allItems.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  return allItems.slice(0, 50);
}
