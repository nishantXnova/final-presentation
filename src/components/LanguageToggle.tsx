import { Languages, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";
import { languages } from "@/lib/languages";

interface LanguageToggleProps {
    isScrolled?: boolean;
}

const LanguageToggle = ({ isScrolled }: LanguageToggleProps) => {
    const { currentLanguage, setLanguage } = useLanguage();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className={`flex items-center gap-2 px-3 h-10 rounded-full transition-all duration-300 ${isScrolled
                        ? "text-foreground hover:bg-muted"
                        : "text-primary-foreground hover:bg-primary-foreground/20"
                        }`}
                >
                    <Languages className="h-5 w-5" />
                    <span className="hidden sm:inline-block font-medium">
                        {currentLanguage.name}
                    </span>
                    <span className="sm:hidden text-lg">{currentLanguage.flag}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 glass-effect p-2 rounded-xl mt-2 animate-fade-in custom-scrollbar max-h-[400px] overflow-y-auto">
                <div className="grid grid-cols-1 gap-1">
                    {languages.map((lang) => (
                        <DropdownMenuItem
                            key={lang.code}
                            onClick={() => setLanguage(lang.code)}
                            className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors duration-200 ${currentLanguage.code === lang.code
                                ? "bg-accent/10 text-accent"
                                : "hover:bg-muted/50"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-xl">{lang.flag}</span>
                                <div className="flex flex-col">
                                    <span className="font-medium text-sm">{lang.name}</span>
                                    <span className="text-xs text-muted-foreground">{lang.nativeName}</span>
                                </div>
                            </div>
                            {currentLanguage.code === lang.code && (
                                <Check className="h-4 w-4 text-accent" />
                            )}
                        </DropdownMenuItem>
                    ))}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default LanguageToggle;
