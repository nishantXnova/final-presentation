import Dexie, { Table } from 'dexie';

/**
 * Currency Cache - Offline currency rates
 */

export interface CachedCurrency {
    id?: number;
    key: string;
    rates: Record<string, number>;
    cachedAt: number;
}

class CurrencyCacheDB extends Dexie {
    currencies!: Table<CachedCurrency>;

    constructor() {
        super('GonepalCurrencyCache');
        this.version(1).stores({
            currencies: '++id, key'
        });
    }
}

export const currencyCache = new CurrencyCacheDB();

// Default rates (fallback when offline and no cache)
const DEFAULT_RATES: Record<string, number> = {
    usd: 1,
    npr: 133.5,
    inr: 83.12,
    eur: 0.92,
    gbp: 0.79,
    aud: 1.53,
    cad: 1.36,
    jpy: 149.5,
    cny: 7.24,
    thb: 35.2,
    bdt: 110.5,
    lkr: 325.0,
};

export const getCachedRates = async (key: string = 'usd'): Promise<Record<string, number>> => {
    // Try cache first
    const cached = await currencyCache.currencies.where('key').equals(key).first();
    
    if (cached) {
        // Check if less than 1 hour old
        const hourInMs = 60 * 60 * 1000;
        if (Date.now() - cached.cachedAt < hourInMs) {
            return cached.rates;
        }
    }
    
    // If online, fetch fresh rates
    if (typeof navigator !== 'undefined' && navigator.onLine) {
        try {
            const urls = [
                `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${key}.min.json`,
                `https://latest.currency-api.pages.dev/v1/currencies/${key}.min.json`,
            ];
            
            for (const url of urls) {
                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.json();
                    if (data[key]) {
                        // Cache the rates
                        await currencyCache.currencies.put({
                            key,
                            rates: data[key],
                            cachedAt: Date.now()
                        });
                        return data[key];
                    }
                }
            }
        } catch (e) {
            console.warn('Currency fetch failed:', e);
        }
    }
    
    // Return cached or default
    if (cached) return cached.rates;
    return DEFAULT_RATES;
};

export const getDefaultRates = () => DEFAULT_RATES;
