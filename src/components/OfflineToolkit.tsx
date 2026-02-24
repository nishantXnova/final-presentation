import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    MapPin, Phone, User, Cloud, AlertTriangle, 
    WifiOff, Wifi, Clock, ChevronDown, ChevronUp,
    Globe, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
    getCachedTrip, 
    isWeatherStale, 
    CachedTripData,
    DigitalID 
} from "@/lib/offlineService";

interface OfflineToolkitProps {
    isOpen: boolean;
    onClose: () => void;
}

const OfflineToolkit: React.FC<OfflineToolkitProps> = ({ isOpen, onClose }) => {
    const [cachedData, setCachedData] = useState<CachedTripData | null>(null);
    const [isOfflineMode, setIsOfflineMode] = useState(false);
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        homeBase: true,
        emergency: true,
        digitalID: true,
        weather: true,
    });

    // Load cached data and monitor online/offline status
    useEffect(() => {
        const loadCachedData = () => {
            const data = getCachedTrip();
            setCachedData(data);
        };

        const updateOnlineStatus = () => {
            setIsOfflineMode(!navigator.onLine);
        };

        // Initial load
        loadCachedData();
        updateOnlineStatus();

        // Event listeners for online/offline
        window.addEventListener("online", updateOnlineStatus);
        window.addEventListener("offline", updateOnlineStatus);

        // Refresh cached data periodically when online
        const interval = setInterval(loadCachedData, 30000);

        return () => {
            window.removeEventListener("online", updateOnlineStatus);
            window.removeEventListener("offline", updateOnlineStatus);
            clearInterval(interval);
        };
    }, []);

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const formatTimestamp = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const isStale = cachedData ? isWeatherStale(cachedData.timestamp) : false;

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl"
                >
                    {/* Header */}
                    <div className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur-md border-b border-slate-700 p-4 rounded-t-3xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Shield className="h-6 w-6 text-nepal-gold" />
                                <h2 className="text-xl font-bold text-white">Offline Toolkit</h2>
                            </div>
                            <div className="flex items-center gap-2">
                                {isOfflineMode ? (
                                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-semibold border border-red-500/30">
                                        <WifiOff className="h-3 w-3" />
                                        OFFLINE MODE
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold border border-green-500/30">
                                        <Wifi className="h-3 w-3" />
                                        ONLINE
                                    </span>
                                )}
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={onClose}
                                    className="ml-2 text-slate-400 hover:text-white"
                                >
                                    ✕
                                </Button>
                            </div>
                        </div>
                        {cachedData && (
                            <div className="flex items-center gap-1.5 mt-2 text-slate-400 text-xs">
                                <Clock className="h-3 w-3" />
                                Last synced: {formatTimestamp(cachedData.timestamp)}
                            </div>
                        )}
                    </div>

                    <div className="p-4 space-y-4">
                        {/* Home Base Section */}
                        {cachedData?.homeCoords && (
                            <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
                                <button
                                    onClick={() => toggleSection("homeBase")}
                                    className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-700/30 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-500/20 rounded-lg">
                                            <MapPin className="h-5 w-5 text-blue-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white">Home Base</h3>
                                            <p className="text-sm text-slate-400">{cachedData.homeCoords.address}</p>
                                        </div>
                                    </div>
                                    {expandedSections.homeBase ? (
                                        <ChevronUp className="h-5 w-5 text-slate-400" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 text-slate-400" />
                                    )}
                                </button>
                                {expandedSections.homeBase && (
                                    <div className="px-4 pb-4 pt-0">
                                        <div className="bg-slate-900/50 rounded-xl p-3 text-sm">
                                            <p className="text-slate-400">
                                                <span className="text-slate-500">Coordinates:</span>{" "}
                                                <span className="font-mono text-blue-300">
                                                    {cachedData.homeCoords.lat.toFixed(4)}, {cachedData.homeCoords.lng.toFixed(4)}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Emergency Phrases Section */}
                        {cachedData?.emergencyPhrases && cachedData.emergencyPhrases.length > 0 && (
                            <div className="bg-red-950/30 rounded-2xl border border-red-800/30 overflow-hidden">
                                <button
                                    onClick={() => toggleSection("emergency")}
                                    className="w-full flex items-center justify-between p-4 text-left hover:bg-red-900/20 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-red-500/20 rounded-lg">
                                            <AlertTriangle className="h-5 w-5 text-red-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-red-100">Emergency Phrases</h3>
                                            <p className="text-sm text-red-300/70">{cachedData.emergencyPhrases.length} phrases</p>
                                        </div>
                                    </div>
                                    {expandedSections.emergency ? (
                                        <ChevronUp className="h-5 w-5 text-red-400" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 text-red-400" />
                                    )}
                                </button>
                                {expandedSections.emergency && (
                                    <div className="px-4 pb-4 pt-0 space-y-2 max-h-64 overflow-y-auto">
                                        {cachedData.emergencyPhrases.map((phrase, index) => (
                                            <div 
                                                key={index} 
                                                className="bg-red-900/20 rounded-xl p-3 border border-red-800/20"
                                            >
                                                <p className="text-white text-sm font-medium">{phrase.english}</p>
                                                <p className="text-red-300 text-sm mt-1">{phrase.nepali}</p>
                                                <p className="text-slate-400 text-xs mt-1 italic">{phrase.phonetic}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Digital ID Section */}
                        {cachedData?.digitalID && (
                            <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
                                <button
                                    onClick={() => toggleSection("digitalID")}
                                    className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-700/30 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-nepal-gold/20 rounded-lg">
                                            <User className="h-5 w-5 text-nepal-gold" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white">Digital ID</h3>
                                            <p className="text-sm text-slate-400">{cachedData.digitalID.name}</p>
                                        </div>
                                    </div>
                                    {expandedSections.digitalID ? (
                                        <ChevronUp className="h-5 w-5 text-slate-400" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 text-slate-400" />
                                    )}
                                </button>
                                {expandedSections.digitalID && (
                                    <div className="px-4 pb-4 pt-0">
                                        <div className="bg-slate-900/50 rounded-xl p-3 space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-slate-500 text-sm">Passport</span>
                                                <span className="text-white font-mono">{cachedData.digitalID.passportNumber}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-500 text-sm">Nationality</span>
                                                <span className="text-white">{cachedData.digitalID.nationality}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-500 text-sm">Date of Birth</span>
                                                <span className="text-white">{cachedData.digitalID.dob}</span>
                                            </div>
                                            <div className="flex items-center gap-2 pt-2 border-t border-slate-700">
                                                <Phone className="h-4 w-4 text-red-400" />
                                                <span className="text-slate-500 text-sm">Emergency:</span>
                                                <span className="text-white">{cachedData.digitalID.emergencyContact}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Weather Section */}
                        {cachedData?.weather && (
                            <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
                                <button
                                    onClick={() => toggleSection("weather")}
                                    className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-700/30 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-cyan-500/20 rounded-lg">
                                            <Cloud className="h-5 w-5 text-cyan-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white">Weather</h3>
                                            <p className="text-sm text-slate-400">{cachedData.weather.location}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {isOfflineMode && isStale && (
                                            <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-xs">
                                                <Clock className="h-3 w-3" />
                                                cached
                                            </span>
                                        )}
                                        {expandedSections.weather ? (
                                            <ChevronUp className="h-5 w-5 text-slate-400" />
                                        ) : (
                                            <ChevronDown className="h-5 w-5 text-slate-400" />
                                        )}
                                    </div>
                                </button>
                                {expandedSections.weather && (
                                    <div className="px-4 pb-4 pt-0">
                                        <div className="bg-slate-900/50 rounded-xl p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-3xl font-bold text-white">
                                                        {cachedData.weather.temp}°C
                                                    </p>
                                                    <p className="text-slate-400">{cachedData.weather.condition}</p>
                                                </div>
                                                {isOfflineMode && isStale && (
                                                    <div className="flex items-center gap-2 text-amber-400 text-sm bg-amber-500/10 px-3 py-2 rounded-lg">
                                                        <AlertTriangle className="h-4 w-4" />
                                                        <span>cached weather may be old</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* No Data Message */}
                        {!cachedData && (
                            <div className="text-center py-8">
                                <Globe className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                                <p className="text-slate-400">No offline data available</p>
                                <p className="text-slate-500 text-sm mt-1">
                                    Use the app online to cache your trip data
                                </p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default OfflineToolkit;
