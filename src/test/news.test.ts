import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchOnlineKhabarNews } from "../lib/newsService";

describe("newsService", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("should fetch and filter news items correctly", async () => {
        const mockItems = [
            { title: "Airport is open", link: "link1", pubDate: "2024-02-19", thumbnail: "img1" },
            { title: "Weather forecast", link: "link2", pubDate: "2024-02-19", thumbnail: "img2" },
            { title: "Flood warning", link: "link3", pubDate: "2024-02-19", thumbnail: "img3" },
            { title: "Irrelevant news", link: "link4", pubDate: "2024-02-19", thumbnail: "img4" },
        ];

        const mockResponse = {
            status: "ok",
            items: mockItems
        };

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockResponse)
        });

        const news = await fetchOnlineKhabarNews();

        expect(news).toHaveLength(3); // Should filter out "Irrelevant news"
        expect(news[0].title).toBe("Airport is open");
        expect(news[2].isEmergency).toBe(true); // "Flood warning" should be emergency
        expect(news[0].source).toBe("Verified Source: OnlineKhabar English");
    });

    it("should handle API errors gracefully", async () => {
        global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));
        const news = await fetchOnlineKhabarNews();
        expect(news).toEqual([]);
    });
});
