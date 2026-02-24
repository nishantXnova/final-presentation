export interface Language {
    code: string;
    name: string;
    flag: string;
    nativeName: string;
}

export const languages: Language[] = [
    { code: "en", name: "English", flag: "🇬🇧", nativeName: "English" },
    { code: "ne", name: "Nepali", flag: "🇳🇵", nativeName: "नेपाली" },
    { code: "hi", name: "Hindi", flag: "🇮🇳", nativeName: "हिन्दी" },
    { code: "zh", name: "Chinese", flag: "🇨🇳", nativeName: "中文" },
    { code: "ja", name: "Japanese", flag: "🇯🇵", nativeName: "日本語" },
    { code: "ko", name: "Korean", flag: "🇰🇷", nativeName: "한국어" },
    { code: "fr", name: "French", flag: "🇫🇷", nativeName: "Français" },
    { code: "de", name: "German", flag: "🇩🇪", nativeName: "Deutsch" },
    { code: "es", name: "Spanish", flag: "🇪🇸", nativeName: "Español" },
    { code: "it", name: "Italian", flag: "🇮🇹", nativeName: "Italiano" },
    { code: "pt", name: "Portuguese", flag: "🇵🇹", nativeName: "Português" },
    { code: "ru", name: "Russian", flag: "🇷🇺", nativeName: "Русский" },
    { code: "ar", name: "Arabic", flag: "🇸🇦", nativeName: "العربية" },
    { code: "bn", name: "Bengali", flag: "🇧🇩", nativeName: "বাংলা" },
    { code: "pa", name: "Punjabi", flag: "🇮🇳", nativeName: "ਪੰਜਾਬੀ" },
    { code: "jv", name: "Javanese", flag: "🇮🇩", nativeName: "Basa Jawa" },
    { code: "vi", name: "Vietnamese", flag: "🇻🇳", nativeName: "Tiếng Việt" },
    { code: "tr", name: "Turkish", flag: "🇹🇷", nativeName: "Türkçe" },
    { code: "th", name: "Thai", flag: "🇹🇭", nativeName: "ไทย" },
    { code: "nl", name: "Dutch", flag: "🇳🇱", nativeName: "Nederlands" },
    { code: "pl", name: "Polish", flag: "🇵🇱", nativeName: "Polski" },
    { code: "ro", name: "Romanian", flag: "🇷🇴", nativeName: "Română" },
];
