import React, { createContext, useContext, useState, useEffect } from "react";
import { languages, Language } from "@/lib/languages";

interface LanguageContextType {
    currentLanguage: Language;
    setLanguage: (code: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentLanguage, setCurrentLanguageState] = useState<Language>(() => {
        const saved = localStorage.getItem("app-language");
        if (saved) {
            const found = languages.find((l) => l.code === saved);
            if (found) return found;
        }
        return languages.find((l) => l.code === "en") || languages[0];
    });

    const setLanguage = (code: string) => {
        const found = languages.find((l) => l.code === code);
        if (found) {
            setCurrentLanguageState(found);
            localStorage.setItem("app-language", code);
        }
    };

    return (
        <LanguageContext.Provider value={{ currentLanguage, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};
