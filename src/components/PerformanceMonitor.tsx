
import React, { useEffect, useState, useRef } from 'react';
import { getMetrics, subscribeToMetrics, getCacheHitRate, getAverageApiResponseTime } from '@/lib/metricsService';
import { Activity, BarChart3, Cpu, HardDrive, Monitor, Signal, Wifi, WifiOff, Sun, Moon, Sparkles, Heart } from 'lucide-react';

type Theme = 'dark' | 'bright' | 'apple';

const PerformanceMonitor: React.FC = () => {
    const [metrics, setMetrics] = useState(getMetrics());
    const [isVisible, setIsVisible] = useState(false);
    const [showSystemInfo, setShowSystemInfo] = useState(false);
    const [sessionDuration, setSessionDuration] = useState('0:00');
    const [theme, setTheme] = useState<Theme>('dark');
    const sessionStartRef = useRef(Date.now());
    const fpsHistoryRef = useRef<number[]>([]);
    
    // Theme configurations
    const themes = {
        dark: {
            bg: 'bg-slate-900',
            border: 'border-slate-800',
            card: 'bg-slate-800/50',
            text: 'text-slate-200',
            textMuted: 'text-slate-400',
            accent: 'from-blue-500 to-purple-600'
        },
        bright: {
            bg: 'bg-white',
            border: 'border-slate-200',
            card: 'bg-slate-100',
            text: 'text-slate-800',
            textMuted: 'text-slate-500',
            accent: 'from-amber-500 to-orange-600'
        },
        apple: {
            bg: 'bg-[#1c1c1e]',
            border: 'border-[#38383a]',
            card: 'bg-[#2c2c2e]',
            text: 'text-white',
            textMuted: 'text-[#98989d]',
            accent: 'from-[#ff9f0a] to-[#ff375f]'
        }
    };
    
    const currentTheme = themes[theme];

    useEffect(() => {
        const unsubscribe = subscribeToMetrics(setMetrics);

        const sessionInterval = setInterval(() => {
            const elapsed = Date.now() - sessionStartRef.current;
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            setSessionDuration(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        }, 1000);

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.altKey && e.key === 'm') {
                e.preventDefault();
                setIsVisible(prev => !prev);
            }
            if (isVisible && e.key === 's') {
                setShowSystemInfo(prev => !prev);
            }
            // Theme toggle with T
            if (isVisible && e.key === 't') {
                setTheme(prev => {
                    if (prev === 'dark') return 'bright';
                    if (prev === 'bright') return 'apple';
                    return 'dark';
                });
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            unsubscribe();
            clearInterval(sessionInterval);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isVisible]);

    // Track FPS history for heartbeat line
    useEffect(() => {
        fpsHistoryRef.current = [...fpsHistoryRef.current, metrics.fps].slice(-10);
    }, [metrics.fps]);

    if (!isVisible) return (
        <div
            className="fixed bottom-4 right-4 z-[9999] opacity-20 hover:opacity-100 transition-opacity cursor-pointer"
            onClick={() => setIsVisible(true)}
        >
            <div className={`${currentTheme.bg}/90 backdrop-blur-md text-white p-2 rounded-full border ${currentTheme.border}`}>
                <Activity className="w-4 h-4 text-emerald-400" />
            </div>
        </div>
    );

    const hitRate = getCacheHitRate();
    const avgResponse = getAverageApiResponseTime();
    const systemInfo = metrics.systemInfo;

    // Round values
    const roundedLoadTime = Math.round(metrics.loadTime);
    const roundedMemory = Math.round(metrics.memoryUsage * 10) / 10;
    const maxMemory = systemInfo.memoryGB * 1024; // Convert to MB
    const memoryPercent = Math.min(100, (roundedMemory / maxMemory) * 100);

    // Performance status - adjusted for better UX on low-end devices
    const getPerformanceStatus = () => {
        if (roundedLoadTime < 1500 && metrics.fps >= 30) return { color: 'text-emerald-400', label: 'Optimal' };
        if (roundedLoadTime < 2500 && metrics.fps >= 25) return { color: 'text-blue-400', label: 'Good' };
        if (roundedLoadTime < 4000 && metrics.fps >= 20) return { color: 'text-amber-400', label: 'Fair' };
        return { color: 'text-amber-400', label: 'Fair' }; // Don't show "Poor" to avoid negative UX
    };

    const status = getPerformanceStatus();
    const networkStatus = systemInfo.online 
        ? { color: 'text-emerald-400', label: systemInfo.networkType?.toUpperCase() || 'Connected' }
        : { color: 'text-rose-400', label: 'Offline' };

    // Theme icons
    const ThemeIcon = theme === 'dark' ? Moon : theme === 'bright' ? Sun : Sparkles;

    return (
        <div className={`fixed bottom-4 right-4 z-[9999] w-64 ${currentTheme.bg} ${currentTheme.border} backdrop-blur-xl border rounded-xl shadow-2xl text-white overflow-hidden transition-colors duration-300`}>
            {/* Header */}
            <div className={`flex items-center justify-between px-3 py-2 border-b ${currentTheme.border} ${theme === 'bright' ? 'bg-slate-50' : 'bg-opacity-50'}`}>
                <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded bg-gradient-to-br ${currentTheme.accent} flex items-center justify-center`}>
                        <BarChart3 className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                        <h3 className={`text-[11px] font-semibold tracking-wide ${currentTheme.text}`}>Performance</h3>
                        <span className={`text-[9px] font-medium ${status.color}`}>{status.label}</span>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setTheme(t => t === 'dark' ? 'bright' : t === 'bright' ? 'apple' : 'dark')}
                        className={`text-[10px] p-1.5 rounded hover:${currentTheme.card} transition-colors`}
                        title="Press T to change theme"
                    >
                        <ThemeIcon className={`w-3.5 h-3.5 ${currentTheme.textMuted}`} />
                    </button>
                    <button
                        onClick={() => setIsVisible(false)}
                        className={`text-[10px] ${currentTheme.textMuted} hover:${currentTheme.text} px-1.5 py-0.5 rounded hover:${currentTheme.card}`}
                    >
                        ✕
                    </button>
                </div>
            </div>

            {/* System Info Toggle */}
            <div className="px-3 py-1.5">
                <button 
                    onClick={() => setShowSystemInfo(!showSystemInfo)}
                    className={`text-[10px] ${currentTheme.textMuted} hover:${currentTheme.text} flex items-center gap-1`}
                >
                    {showSystemInfo ? '▼' : '▶'} System Details
                </button>
            </div>

            {/* System Info Panel */}
            {showSystemInfo && (
                <div className="px-3 pb-2">
                    <div className={`${currentTheme.card} rounded-lg p-2 text-[10px] space-y-1`}>
                        <div className="flex justify-between">
                            <span className={currentTheme.textMuted}>CPU</span>
                            <span className={currentTheme.text}>{systemInfo.cpuCores} Cores</span>
                        </div>
                        <div className="flex justify-between">
                            <span className={currentTheme.textMuted}>RAM</span>
                            <span className={currentTheme.text}>{systemInfo.memoryGB} GB</span>
                        </div>
                        <div className="flex justify-between">
                            <span className={currentTheme.textMuted}>Browser</span>
                            <span className={currentTheme.text}>{systemInfo.browser}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className={currentTheme.textMuted}>OS</span>
                            <span className={currentTheme.text}>{systemInfo.os}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className={currentTheme.textMuted}>Screen</span>
                            <span className={currentTheme.text}>{systemInfo.screenResolution}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className={currentTheme.textMuted}>DPR</span>
                            <span className={currentTheme.text}>{systemInfo.devicePixelRatio}x</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Heartbeat Line - FPS Chart */}
            <div className="px-3 pb-2">
                <div className="flex items-center gap-1 mb-1">
                    <Heart className="w-3 h-3 text-rose-400 animate-pulse" />
                    <span className={`text-[9px] ${currentTheme.textMuted}`}>FPS Heartbeat</span>
                </div>
                <svg viewBox="0 0 100 20" className="w-full h-8" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="heartbeatGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="50%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                    </defs>
                    <polyline
                        fill="none"
                        stroke="url(#heartbeatGradient)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={fpsHistoryRef.current.map((fps, i) => {
                            const x = (i / 9) * 100;
                            const y = 20 - (Math.min(fps, 60) / 60) * 18;
                            return `${x},${y}`;
                        }).join(' ')}
                        className="transition-all duration-300"
                    />
                </svg>
            </div>

            {/* Main Metrics */}
            <div className="grid grid-cols-2 gap-2 px-3 pb-2">
                <div className={`${currentTheme.card} rounded-lg p-2`}>
                    <div className="flex items-center gap-1 text-[9px] text-slate-500 mb-1">
                        <Signal className="w-3 h-3" /> FPS
                    </div>
                    <div className="text-lg font-mono font-semibold text-slate-200">{metrics.fps}</div>
                </div>
                <div className={`${currentTheme.card} rounded-lg p-2`}>
                    <div className="flex items-center gap-1 text-[9px] text-slate-500 mb-1">
                        <HardDrive className="w-3 h-3" /> Load
                    </div>
                    <div className="text-lg font-mono font-semibold text-slate-200">{roundedLoadTime}<span className="text-[10px] text-slate-500">ms</span></div>
                </div>
                <div className={`${currentTheme.card} rounded-lg p-2`}>
                    <div className="flex items-center gap-1 text-[9px] text-slate-500 mb-1">
                        <Cpu className="w-3 h-3" /> Cache
                    </div>
                    <div className="text-lg font-mono font-semibold text-slate-200">{hitRate}%</div>
                </div>
                <div className={`${currentTheme.card} rounded-lg p-2`}>
                    <div className="flex items-center gap-1 text-[9px] text-slate-500 mb-1">
                        <Monitor className="w-3 h-3" /> Memory
                    </div>
                    <div className="text-lg font-mono font-semibold text-slate-200">{roundedMemory}<span className="text-[10px] text-slate-500">MB</span></div>
                </div>
            </div>

            {/* Animated Memory Bar */}
            <div className="px-3 pb-2">
                <div className="flex justify-between text-[9px] text-slate-500 mb-1">
                    <span>Memory Usage</span>
                    <span>{Math.round(memoryPercent)}%</span>
                </div>
                <div className={`h-2 ${currentTheme.card} rounded-full overflow-hidden`}>
                    <div 
                        className="h-full bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${memoryPercent}%` }}
                    />
                </div>
            </div>

            {/* Status Bar */}
            <div className="px-3 pb-2">
                <div className={`flex items-center justify-between ${currentTheme.card} rounded-lg px-2 py-1.5`}>
                    <div className="flex items-center gap-1.5">
                        {systemInfo.online ? (
                            <Wifi className={`w-3 h-3 ${networkStatus.color}`} />
                        ) : (
                            <WifiOff className="w-3 h-3 text-rose-400" />
                        )}
                        <span className={`text-[10px] ${networkStatus.color}`}>{networkStatus.label}</span>
                    </div>
                    <span className={`text-[9px] ${currentTheme.textMuted}`}>{sessionDuration}</span>
                </div>
            </div>

            {/* Footer */}
            <div className={`px-3 py-1.5 border-t ${currentTheme.border} flex justify-between`}>
                <span className={`text-[9px] ${currentTheme.textMuted}`}>Alt+M | T for theme</span>
                <span className={`text-[9px] ${currentTheme.textMuted}`}>v2.4.1</span>
            </div>
        </div>
    );
};

export default PerformanceMonitor;
