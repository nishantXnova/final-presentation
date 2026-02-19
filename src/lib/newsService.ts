export interface NewsItem {
    title: string;
    link: string;
    pubDate: string;
    thumbnail: string;
    source: string;
    isEmergency: boolean;
    lastUpdated: string;
}

const NEPAL_FALLBACK_IMAGE = "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1000&auto=format&fit=crop";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapItems = (items: any[], sourceName: string): NewsItem[] => {
    const emergencyKeywords = ['flood', 'landslide', 'earthquake', 'avalanche', 'emergency', 'disaster', 'alert'];
    return items.slice(0, 10).map((item): NewsItem => {
        const titleLower = item.title.toLowerCase();
        const isEmergency = emergencyKeywords.some(k => titleLower.includes(k));
        return {
            title: item.title,
            link: item.link,
            pubDate: item.pubDate || new Date().toISOString(),
            thumbnail: item.thumbnail || item.enclosure?.link || NEPAL_FALLBACK_IMAGE,
            source: `Verified Source: ${sourceName}`,
            isEmergency,
            lastUpdated: new Date().toLocaleTimeString(),
        };
    });
};

const SOURCES = [
    {
        name: 'OnlineKhabar English',
        rss: 'https://english.onlinekhabar.com/feed',
    },
    {
        name: 'OnlineKhabar',
        rss: 'https://www.onlinekhabar.com/feed',
    },
];

export const fetchNepalNews = async (): Promise<NewsItem[]> => {
    for (const source of SOURCES) {
        try {
            const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(source.rss)}&count=10`;
            const response = await fetch(apiUrl);
            if (!response.ok) continue;
            const data = await response.json();
            if (data.status !== 'ok' || !data.items?.length) continue;

            console.info(`[News] Loaded from: ${source.name}`);
            return mapItems(data.items, source.name);
        } catch (err) {
            console.warn(`[News] Failed source ${source.name}:`, err);
        }
    }

    console.error('[News] All sources failed.');
    return [];
};

// Keep old export name as alias for backward compat
export const fetchOnlineKhabarNews = fetchNepalNews;
