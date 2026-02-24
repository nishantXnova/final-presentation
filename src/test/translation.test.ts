import { describe, it, expect, vi, beforeEach } from "vitest";
import { translateText, clearTranslationCache } from "../lib/translationService";

describe("translationService", () => {
    beforeEach(() => {
        vi.resetAllMocks();
        clearTranslationCache();
    });

    it("should return translated text on success", async () => {
        // Mock successful Google Translate response
        const mockResponse = [[["नमस्ते", "Hello"]], null, "en"];
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockResponse),
        } as Response));

        const result = await translateText("Hello", "en", "ne");
        expect(result).toBe("नमस्ते");
    });

    it("should handle multi-sentence translation", async () => {
        const mockResponse = [[["नमस्ते।", "Hello."], ["सञ्चै छ? \u091b?", "How are you?"]], null, "en"];
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockResponse),
        } as Response));

        const result = await translateText("Hello. How are you?", "en", "ne");
        expect(result).toBe("नमस्ते। सञ्चै छ? \u091b?");
    });

    it("should fallback to original text on fetch failure", async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: false,
            statusText: "Forbidden",
        } as Response));

        const result = await translateText("Hello", "en", "ne");
        expect(result).toBe("Hello");
    });

    it("should handle network errors", async () => {
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error("Network Error")));

        const result = await translateText("Hello", "en", "ne");
        expect(result).toBe("Hello");
    });

    it("should return empty string for empty input", async () => {
        const result = await translateText("", "en", "ne");
        expect(result).toBe("");
    });
});
