import React, { createContext, useContext, useState, ReactNode } from "react";

interface WeatherContextType {
    isOpen: boolean;
    openWeather: () => void;
    closeWeather: () => void;
    toggleWeather: () => void;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider = ({ children }: { children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);

    const openWeather = () => setIsOpen(true);
    const closeWeather = () => setIsOpen(false);
    const toggleWeather = () => setIsOpen((prev) => !prev);

    return (
        <WeatherContext.Provider value={{ isOpen, openWeather, closeWeather, toggleWeather }}>
            {children}
        </WeatherContext.Provider>
    );
};

export const useWeather = () => {
    const context = useContext(WeatherContext);
    if (context === undefined) {
        throw new Error("useWeather must be used within a WeatherProvider");
    }
    return context;
};
