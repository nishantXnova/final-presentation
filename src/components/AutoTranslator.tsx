import { useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translateText } from "@/lib/translationService";

const AutoTranslator = () => {
    const { currentLanguage } = useLanguage();
    const observerRef = useRef<MutationObserver | null>(null);

    // Track original text for each node to allow switching back to English
    const originalTextMap = useRef<Map<Node, string>>(new Map());

    const isBrandName = (text: string) => {
        return text.trim() === "GoNepal" || text.trim() === "Go Nepal";
    };

    const shouldTranslate = (node: Node) => {
        if (!node.textContent || node.textContent.trim().length < 2) return false;
        if (isBrandName(node.textContent)) return false;

        // Ignore script, style, and icon tags
        const parent = node.parentElement;
        if (parent) {
            const tag = parent.tagName.toLowerCase();
            if (["script", "style", "noscript", "svg", "path"].includes(tag)) return false;
            // Also ignore elements that have already been translated
            if (parent.dataset.translated === "true" && currentLanguage.code !== "en") return false;
        }

        return true;
    };

    const translateNode = async (node: Node) => {
        if (!shouldTranslate(node)) return;

        // Save original text if not already saved
        if (!originalTextMap.current.has(node)) {
            originalTextMap.current.set(node, node.textContent || "");
        }

        const originalText = originalTextMap.current.get(node);
        if (!originalText) return;

        if (currentLanguage.code === "en") {
            node.textContent = originalText;
            if (node.parentElement) delete node.parentElement.dataset.translated;
            return;
        }

        try {
            const translated = await translateText(originalText, "en", currentLanguage.code);
            if (translated && translated !== originalText) {
                node.textContent = translated;
                if (node.parentElement) node.parentElement.dataset.translated = "true";
            }
        } catch (error) {
            console.error("Auto-translation error for node:", error);
        }
    };

    const processNodes = (root: Node) => {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
        let node;
        while ((node = walker.nextNode())) {
            translateNode(node);
        }
    };

    useEffect(() => {
        // Initial translation of the whole page
        processNodes(document.body);

        // Setup mutation observer for dynamic content
        observerRef.current = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        translateNode(node);
                    } else {
                        processNodes(node);
                    }
                });
            });
        });

        observerRef.current.observe(document.body, {
            childList: true,
            subtree: true,
        });

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [currentLanguage.code]);

    return null; // This component doesn't render anything
};

export default AutoTranslator;
