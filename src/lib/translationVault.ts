import Dexie, { Table } from 'dexie';

/**
 * Translation Vault - IndexedDB storage using Dexie.js
 * This enables unlimited offline translation storage (vs localStorage's 5MB limit)
 * 
 * The "Vault" concept:
 * - When user picks a language online, translations are saved to this vault
 * - When offline, the app checks this vault first before showing English text
 * - This ensures "baked" translations are available at high-altitude camps
 */

export interface TranslationEntry {
    id?: number;
    cacheKey: string;      // format: "from-to-originalText"
    originalText: string;
    translatedText: string;
    fromLang: string;
    toLang: string;
    timestamp: number;
}

class TranslationVault extends Dexie {
    translations!: Table<TranslationEntry>;

    constructor() {
        super('GonepalTranslationVault');
        this.version(1).stores({
            translations: '++id, cacheKey, originalText, toLang, timestamp'
        });
    }
}

// Create singleton instance
export const translationVault = new TranslationVault();

/**
 * Clear all cached translations (useful for testing or language switch)
 */
export const clearTranslationVault = async () => {
    await translationVault.translations.clear();
};

/**
 * Get translation count in vault
 */
export const getVaultSize = async (): Promise<number> => {
    return await translationVault.translations.count();
};

/**
 * Check if we're online
 */
export const isOnline = (): boolean => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
};
