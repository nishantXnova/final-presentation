import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X, MapPin, Sun, Cloud, CloudRain, Loader2, Sparkles,
    Navigation, Clock, ExternalLink, Route, Wind, Droplets,
    Thermometer, ChevronRight, Calendar, Coffee, Camera,
    Utensils, Landmark, TreePine, Mountain, Star, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PlanMyDayProps {
    isOpen: boolean;
    onClose: () => void;
}

interface WeatherData {
    temperature: number;
    condition: string;
    conditionCode: number;
    locationName: string;
    windSpeed: number;
    humidity: number;
}

interface TouristSpot {
    id: string;
    name: string;
    description: string;
    type: 'nature' | 'culture' | 'adventure' | 'food';
    tip: string;
    duration: string;
    lat: number;
    lng: number;
}

const NEPAL_SPOTS: TouristSpot[] = [
    { id: '1', name: 'Swayambhunath Stupa', description: 'The famous Monkey Temple with panoramic Kathmandu views.', type: 'culture', tip: 'Visit early morning to see locals performing rituals.', duration: '1.5h', lat: 27.7149, lng: 85.2904 },
    { id: '2', name: 'Patan Durbar Square', description: 'Marvel at the ancient Newari architecture and stone carvings.', type: 'culture', tip: 'Check out the Golden Temple tucked in a side alley.', duration: '2h', lat: 27.6744, lng: 85.3253 },
    { id: '3', name: 'Boudhanath Stupa', description: 'One of the largest spherical stupas in the world.', type: 'culture', tip: 'Circircle the stupa clockwise (Kora) with the pilgrims.', duration: '1h', lat: 27.7215, lng: 85.3620 },
    { id: '4', name: 'Garden of Dreams', description: 'A neo-classical historical garden in the heart of Thamel.', type: 'nature', tip: 'Perfect spot for a quiet lunch away from Thamel noise.', duration: '1.5h', lat: 27.7142, lng: 85.3145 },
    { id: '5', name: 'Shivapuri Nagarjun National Park', description: 'Best for day hiking and bird watching near the city.', type: 'adventure', tip: 'Hire a guide for the Nagi Gumba trail.', duration: '4h', lat: 27.7983, lng: 85.3771 },
    { id: '6', name: 'Chandragiri Hills', description: 'Take a cable car ride for the best Everest range views.', type: 'adventure', tip: 'Go on a clear winter day for 180-degree mountain views.', duration: '3h', lat: 27.6695, lng: 85.2104 },
    { id: '7', name: 'Narayanhiti Palace Museum', description: 'Former royal residence turned into a fascinating museum.', type: 'culture', tip: 'Photography is restricted inside; allow time for security.', duration: '2h', lat: 27.7150, lng: 85.3180 },
    { id: '8', name: 'Nagarkot Viewpoint', description: 'Hill station famous for sunrise views of the Himalayas.', type: 'nature', tip: "Stay overnight to catch the sunrise; it's worth it.", duration: '5h', lat: 27.7183, lng: 85.5214 },
];

const TYPE_COLORS = {
    nature: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    culture: 'bg-amber-50 text-amber-700 border-amber-100',
    adventure: 'bg-blue-50 text-blue-700 border-blue-100',
    food: 'bg-rose-50 text-rose-700 border-rose-100',
};

const TYPE_ICONS = {
    nature: <TreePine className="w-3.5 h-3.5" />,
    culture: <Landmark className="w-3.5 h-3.5" />,
    adventure: <Mountain className="w-3.5 h-3.5" />,
    food: <Utensils className="w-3.5 h-3.5" />,
};

const PlanMyDay = ({ isOpen, onClose }: PlanMyDayProps) => {
    const [step, setStep] = useState<'locating' | 'weather' | 'done'>('locating');
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [stops, setStops] = useState<TouristSpot[]>([]);
    const [mapsUrl, setMapsUrl] = useState('');
    const [totalDuration, setTotalDuration] = useState(0);

    const startFlow = async () => {
        setStep('locating');

        // 1. Get Location
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;
                setStep('weather');

                try {
                    // 2. Fetch Weather
                    const wRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m`);
                    const wData = await wRes.json();

                    // Geocoding (Nomination)
                    const gRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const gData = await gRes.json();

                    const current = wData.current;
                    const weatherObj: WeatherData = {
                        temperature: Math.round(current.temperature_2m),
                        condition: getWeatherLabel(current.weather_code),
                        conditionCode: current.weather_code,
                        locationName: gData.address.city || gData.address.town || 'Kathmandu',
                        windSpeed: current.wind_speed_10m,
                        humidity: current.relative_humidity_2m
                    };
                    setWeather(weatherObj);

                    // 3. Generate Itinerary
                    const selected = NEPAL_SPOTS
                        .sort(() => 0.5 - Math.random())
                        .slice(0, 4);

                    setStops(selected);

                    // 4. Build Maps URL
                    const origin = `${latitude},${longitude}`;
                    const destination = `${selected[selected.length - 1].lat},${selected[selected.length - 1].lng}`;
                    const waypoints = selected.slice(0, -1).map(s => `${s.lat},${s.lng}`).join('|');
                    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${waypoints}&travelmode=walking`;
                    setMapsUrl(url);

                    setTotalDuration(240); // Mock total 4h
                    setStep('done');
                } catch (err) {
                    console.error("PlanMyDay Error:", err);
                    onClose();
                }
            },
            () => {
                // Fallback to Kathmandu if geolocation denied
                setStep('done');
                onClose();
            }
        );
    };

    useEffect(() => {
        if (isOpen) {
            startFlow();
        }
    }, [isOpen]);

    const getWeatherLabel = (code: number) => {
        if (code === 0) return 'Clear Skies';
        if (code < 3) return 'Partly Cloudy';
        if (code < 50) return 'Overcast';
        if (code < 70) return 'Rainy';
        return 'Stormy';
    };

    const getWeatherIcon = (code: number) => {
        if (code === 0) return <Sun className="w-8 h-8 text-yellow-500" />;
        if (code < 3) return <Cloud className="w-8 h-8 text-gray-400" />;
        return <CloudRain className="w-8 h-8 text-blue-500" />;
    };

    const getContextualOpening = (w: WeatherData) => {
        if (w.conditionCode > 50) return "It's a bit drizzly, so we've found some amazing indoor heritage spots for you.";
        if (w.temperature > 25) return "Warm sun calls for gardens and hill views. Stay hydrated!";
        return "Crisp mountain air! Perfect for walking through the historic squares.";
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-md"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.95 }}
                        transition={{ type: "spring", damping: 28, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full sm:max-w-xl bg-white/90 backdrop-blur-xl rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-white/20"
                    >
                        {/* Sticky Header with Shimmer and Wave Decoration */}
                        <div className="relative bg-gradient-to-br from-[#E41B17] via-[#c0151a] to-[#8b0000] text-white p-6 pb-10 flex-shrink-0 overflow-hidden">
                            {/* Animated Background Elements */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"
                            />
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
                            <div className="absolute top-0 left-1/4 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-y-12 translate-y-8" />

                            <div className="relative flex items-start justify-between">
                                <div>
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex items-center gap-2 mb-2"
                                    >
                                        <div className="p-1 px-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center gap-1.5">
                                            <Sparkles className="w-3 h-3 text-yellow-300" />
                                            <span className="text-white text-[10px] font-bold uppercase tracking-[0.2em]">Smart Concierge</span>
                                        </div>
                                    </motion.div>
                                    <h2 className="text-3xl font-extrabold tracking-tight">Plan My Day</h2>
                                    <p className="text-white/80 text-sm mt-1 max-w-[280px]">Your personalized Himalayan journey, curated by AI based on real-time weather.</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 transition-all border border-white/10 hover:scale-110 active:scale-95 group"
                                >
                                    <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                                </button>
                            </div>
                        </div>

                        {/* White overlap section for better mobile scroll feel */}
                        <div className="relative -mt-6 bg-white rounded-t-[2.5rem] flex-1 overflow-visible z-10">
                            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-200 rounded-full sm:hidden" />

                            {/* Scrollable Content */}
                            <div className="h-full overflow-y-auto custom-scrollbar p-6">
                                {(step === 'locating' || step === 'weather') && (
                                    <div className="flex flex-col items-center justify-center py-20 px-6 gap-6">
                                        <div className="relative">
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                className="w-20 h-20 rounded-full border-4 border-dashed border-[#E41B17]/20"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <motion.div
                                                    animate={{ scale: [1, 1.2, 1] }}
                                                    transition={{ duration: 1, repeat: Infinity }}
                                                >
                                                    {step === 'locating' ? <MapPin className="w-8 h-8 text-[#E41B17]" /> : <Sun className="w-8 h-8 text-yellow-500" />}
                                                </motion.div>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-gray-900 font-bold text-lg mb-1">
                                                {step === 'locating' ? "Locating your adventure…" : "Consulting the skies…"}
                                            </p>
                                            <p className="text-gray-400 text-sm font-medium">Almost ready to show you the best of Nepal</p>
                                        </div>
                                    </div>
                                )}

                                {step === 'done' && weather && (
                                    <div className="space-y-8 pb-10">
                                        {/* Weather Summary Card */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="relative bg-gradient-to-br from-indigo-50/50 via-white to-blue-50/30 rounded-3xl p-6 border border-gray-100 shadow-sm overflow-hidden"
                                        >
                                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                                <Mountain className="w-24 h-24" />
                                            </div>

                                            <div className="flex items-center justify-between relative z-10">
                                                <div className="flex items-center gap-4">
                                                    <motion.div
                                                        animate={{ y: [0, -5, 0] }}
                                                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                                        className="p-4 bg-white rounded-2xl shadow-sm"
                                                    >
                                                        {getWeatherIcon(weather.conditionCode)}
                                                    </motion.div>
                                                    <div>
                                                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Current Skies</p>
                                                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                                            {weather.locationName}
                                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                                        </h3>
                                                        <p className="text-gray-500 text-sm font-medium">{weather.condition}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-4xl font-black text-gray-900 leading-none">{weather.temperature}°</span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 mt-6">
                                                <div className="flex items-center gap-3 px-4 py-3 bg-white/60 rounded-2xl border border-gray-50">
                                                    <Wind className="w-4 h-4 text-blue-400" />
                                                    <div>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase leading-none mb-1">Wind</p>
                                                        <p className="text-sm font-bold text-gray-700 leading-none">{weather.windSpeed} km/h</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 px-4 py-3 bg-white/60 rounded-2xl border border-gray-50">
                                                    <Droplets className="w-4 h-4 text-indigo-400" />
                                                    <div>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase leading-none mb-1">Humidity</p>
                                                        <p className="text-sm font-bold text-gray-700 leading-none">{weather.humidity}%</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-6 pt-4 border-t border-gray-100">
                                                <p className="text-sm font-semibold text-gray-800 leading-relaxed italic">
                                                    “{getContextualOpening(weather)}”
                                                </p>
                                            </div>
                                        </motion.div>

                                        {/* Itinerary Header */}
                                        <div className="flex items-center justify-between px-2">
                                            <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                                <Navigation className="w-5 h-5 text-[#E41B17]" />
                                                4-Stop Walking Tour
                                            </h4>
                                            <div className="flex items-center gap-1.5 py-1 px-3 bg-gray-100 rounded-full text-[10px] font-bold text-gray-500">
                                                <Clock className="w-3.5 h-3.5" />
                                                ~4h
                                            </div>
                                        </div>

                                        {/* Staggered Itinerary List */}
                                        <div className="space-y-4">
                                            {stops.map((stop, index) => (
                                                <motion.div
                                                    key={stop.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.3 + index * 0.1 }}
                                                    whileHover={{ x: 5 }}
                                                    className="group relative bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
                                                >
                                                    <div className="flex items-stretch">
                                                        {/* Step Indicator */}
                                                        <div className="w-16 flex flex-col items-center py-4 border-r border-gray-50">
                                                            <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-[#E41B17] group-hover:text-white transition-colors flex items-center justify-center font-bold text-gray-400 text-sm">
                                                                {index + 1}
                                                            </div>
                                                            {index < stops.length - 1 && (
                                                                <div className="flex-1 w-[2px] bg-gray-50 my-2" />
                                                            )}
                                                        </div>

                                                        {/* Stop Content */}
                                                        <div className="flex-1 p-5 pl-4">
                                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                                <h5 className="font-bold text-gray-900 group-hover:text-[#E41B17] transition-colors">{stop.name}</h5>
                                                                <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-tighter shrink-0">
                                                                    <Clock className="w-3 h-3" />
                                                                    {stop.duration}
                                                                </span>
                                                            </div>
                                                            <p className="text-gray-500 text-xs leading-relaxed mb-3">{stop.description}</p>

                                                            <div className="flex items-center gap-2 mb-3">
                                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border transition-colors ${TYPE_COLORS[stop.type]}`}>
                                                                    {TYPE_ICONS[stop.type]}
                                                                    {stop.type.toUpperCase()}
                                                                </span>
                                                            </div>

                                                            {/* Pro Tip Bubble */}
                                                            <div className="relative overflow-hidden bg-amber-50/50 rounded-2xl p-3 border border-amber-100/50">
                                                                <div className="absolute top-0 right-0 p-1">
                                                                    <Sparkles className="w-10 h-10 text-amber-500/10" />
                                                                </div>
                                                                <p className="text-[11px] text-amber-900 leading-tight">
                                                                    <span className="font-black uppercase text-[9px] mr-1.5">Pro Tip:</span>
                                                                    {stop.tip}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>

                                        {/* Action Area */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.8 }}
                                            className="pt-4"
                                        >
                                            <a
                                                href={mapsUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block w-full"
                                            >
                                                <Button className="w-full h-16 bg-gradient-to-r from-[#E41B17] to-[#8b0000] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-red-500/20 rounded-2xl group overflow-hidden relative">
                                                    <motion.div
                                                        className="absolute inset-0 bg-white/20 translate-x-[-100%]"
                                                        animate={{ translateX: ["100%", "-100%"] }}
                                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                    />
                                                    <div className="relative flex items-center justify-center gap-3 font-bold text-lg">
                                                        <MapPin className="w-6 h-6 group-hover:animate-bounce text-white" />
                                                        <span className="text-white">Start Journey (Google Maps)</span>
                                                        <ExternalLink className="w-4 h-4 text-white opacity-50" />
                                                    </div>
                                                </Button>
                                            </a>
                                            <p className="text-center text-[10px] text-gray-400 mt-4 font-medium uppercase tracking-widest">
                                                All destinations synced to walking directions
                                            </p>
                                        </motion.div>

                                        {/* Refresh Button */}
                                        <button
                                            onClick={startFlow}
                                            className="w-full flex items-center justify-center gap-2 py-4 text-xs font-bold text-gray-400 hover:text-[#E41B17] transition-colors border-t border-gray-50 mt-4"
                                        >
                                            <RefreshCw className="w-3 h-3" />
                                            LOOKING FOR SOMETHING ELSE? REGENERATE
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PlanMyDay;
