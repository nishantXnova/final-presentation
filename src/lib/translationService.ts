/**
 * Simple translation service using free Google Translate GTX endpoint.
 * This does not require an API key.
 */

export interface TranslationResult {
    text: string;
    sourceLang: string;
    targetLang: string;
}

const GOOGLE_TRANSLATE_URL = "https://translate.googleapis.com/translate_a/single";

// Cache for translations to avoid redundant API calls
const translationCache: Record<string, string> = {};

export const translateText = async (
    text: string,
    from: string = "auto",
    to: string = "ne"
): Promise<string> => {
    if (!text.trim()) return "";

    // Create a unique cache key
    const cacheKey = `${from}-${to}-${text}`;
    if (translationCache[cacheKey]) {
        return translationCache[cacheKey];
    }

    try {
        const params = new URLSearchParams({
            client: "gtx",
            sl: from,
            tl: to,
            dt: "t",
            q: text,
        });

        const response = await fetch(`${GOOGLE_TRANSLATE_URL}?${params.toString()}`);

        if (!response.ok) {
            throw new Error(`Translation failed: ${response.statusText}`);
        }

        const data = await response.json();

        if (data && data[0]) {
            const translatedParts = data[0].map((part: any) => part[0]);
            const result = translatedParts.join(" ");

            // Store in cache
            translationCache[cacheKey] = result;
            return result;
        }

        throw new Error("Invalid response format from translation service");
    } catch (error) {
        console.error("Translation error:", error);
        return text; // Fallback to original text on error
    }
};
