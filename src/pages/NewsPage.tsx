import { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Newspaper, AlertTriangle, Clock, ExternalLink,
    Sparkles, Send, Bot, Loader2, RefreshCw, ShieldCheck, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { fetchNepalNews, type NewsItem } from '@/lib/newsService';
import { supabase } from '@/integrations/supabase/client';

interface AiMessage {
    role: 'user' | 'assistant';
    content: string;
}

// Keywords for different badge types
const EMERGENCY_KEYWORDS = ['flood', 'earthquake', 'landslide', 'bandh', 'border closed', 'airport closed'];
const SAFETY_KEYWORDS = ['wildlife', 'tiger', 'elephant', 'bear', 'snake', 'accident', 'robbery', 'theft', 'attack', 'safety'];
const ELECTION_KEYWORDS = ['election', 'vote', 'political', 'protest', 'rally', 'parliament', 'government', 'minister', 'party'];

// Determine badge type based on title/content
const getBadgeType = (item: NewsItem): 'emergency' | 'advisory' | 'safety' | null => {
    const text = `${item.title} ${item.content || ''}`.toLowerCase();
    
    // Check emergency first
    if (EMERGENCY_KEYWORDS.some(keyword => text.includes(keyword))) {
        return 'emergency';
    }
    
    // Check safety
    if (SAFETY_KEYWORDS.some(keyword => text.includes(keyword))) {
        return 'safety';
    }
    
    // Check election/political
    if (ELECTION_KEYWORDS.some(keyword => text.includes(keyword))) {
        return 'advisory';
    }
    
    return null;
};

// Determine travel impact based on content
const getTravelImpact = (content: string): 'low' | 'moderate' | 'high' => {
    const text = content.toLowerCase();
    
    if (EMERGENCY_KEYWORDS.some(keyword => text.includes(keyword)) || 
        SAFETY_KEYWORDS.some(keyword => text.includes(keyword))) {
        return 'high';
    }
    
    if (ELECTION_KEYWORDS.some(keyword => text.includes(keyword))) {
        return 'moderate';
    }
    
    return 'low';
};

const TOURIST_SYSTEM_PROMPT = `You are Nepal News Buddy, an AI news summarizer specially designed for tourists visiting Nepal.
Your role is to:
1. Summarize news articles in simple, clear English that any tourist can understand.
2. Highlight how each news item might affect travel plans (e.g. road closures, festival dates, weather alerts).
3. Always recommend safety precautions when reporting on floods, landslides, or severe weather.
4. Mention relevant tourist tips where appropriate (e.g. "This festival is a great time to visit Kathmandu!").
5. Keep summaries friendly, concise, and upbeat unless it's an emergency alert.
6. Format: Start with a 1-sentence TL;DR, then 2-3 bullet points of tourist-relevant details.`;

const NewsCard = ({ item, onSummarize }: { item: NewsItem; onSummarize: (item: NewsItem) => void }) => {
    const formattedDate = new Date(item.pubDate).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
    });
    
    const badgeType = getBadgeType(item);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl border border-black/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-300 flex flex-col overflow-hidden"
        >
            {/* Thumbnail */}
            {item.thumbnail && (
                <div className="relative h-[180px] overflow-hidden">
                    <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        style={{ borderRadius: '8px 8px 0 0' }}
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1000&auto=format&fit=crop";
                        }}
                    />
                    {badgeType === 'emergency' && (
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                            <AlertTriangle className="w-3 h-3" />
                            Emergency
                        </div>
                    )}
                    {badgeType === 'advisory' && (
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                            ⚠️ Travel Advisory
                        </div>
                    )}
                    {badgeType === 'safety' && (
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                            🔴 Safety Alert
                        </div>
                    )}
                </div>
            )}

            <div className="p-5 flex flex-col flex-1">
                {/* Badge when no image */}
                {badgeType && !item.thumbnail && (
                    <div className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide mb-3 self-start ${
                        badgeType === 'emergency' ? 'bg-red-500 text-white' :
                        badgeType === 'advisory' ? 'bg-amber-500 text-white' :
                        'bg-red-600 text-white'
                    }`}>
                        {badgeType === 'emergency' && <AlertTriangle className="w-3 h-3" />}
                        {badgeType === 'emergency' ? 'Emergency' : badgeType === 'advisory' ? '⚠️ Travel Advisory' : '🔴 Safety Alert'}
                    </div>
                )}

                {/* Title */}
                <h3 className="font-semibold text-base leading-snug mb-3 line-clamp-3 text-gray-900">
                    {item.title}
                </h3>

                {/* Footer */}
                <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {formattedDate}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            onClick={() => onSummarize(item)}
                            className="text-xs h-7 px-3 bg-[#E67E22] hover:bg-[#D35400] text-white gap-1 rounded-md transition-all duration-200 hover:shadow-[0_0_12px_rgba(230,126,34,0.4)]"
                        >
                            <Sparkles className="w-3 h-3" />
                            AI Summary
                        </Button>
                        <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs flex items-center gap-1 text-gray-500 hover:text-[#E67E22] transition-colors"
                        >
                            <ExternalLink className="w-3 h-3" />
                            Read
                        </a>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

type FilterTab = 'all' | 'safety' | 'weather' | 'transport' | 'culture';

const FILTER_TABS: { id: FilterTab; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'safety', label: 'Safety' },
    { id: 'weather', label: 'Weather' },
    { id: 'transport', label: 'Transport' },
    { id: 'culture', label: 'Culture' },
];

const FILTER_KEYWORDS: Record<FilterTab, string[]> = {
    all: [],
    safety: ['safety', 'alert', 'emergency', 'flood', 'earthquake', 'landslide', 'accident', 'health', 'hospital', 'police'],
    weather: ['weather', 'rain', 'monsoon', 'snow', 'temperature', 'forecast', 'climate'],
    transport: ['flight', 'airport', 'road', 'bus', 'taxi', 'tour', 'trek', 'route', 'closed', 'open'],
    culture: ['festival', 'culture', 'religious', 'temple', 'dance', 'music', 'celebration', 'holiday'],
};

const NewsPage = () => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<string>('');
    const [activeTab, setActiveTab] = useState<FilterTab>('all');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [aiMessages, setAiMessages] = useState<AiMessage[]>([
        {
            role: 'assistant',
            content: "Namaste! 🙏 I'm Nepal News Buddy. Click **\"AI Summary\"** on any article and I'll explain what it means for your trip — in plain English!"
        }
    ]);
    const [aiInput, setAiInput] = useState('');
    const [aiLoading, setAiLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    useEffect(scrollToBottom, [aiMessages]);

    const loadNews = async () => {
        setLoading(true);
        setError(null);
        try {
            const items = await fetchNepalNews();
            setNews(items);
            setLastUpdated(new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }));
        } catch {
            setError('Could not load news. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await loadNews();
        setTimeout(() => setIsRefreshing(false), 500);
    };

    useEffect(() => { loadNews(); }, []);

    // Filter news based on active tab
    const filteredNews = useMemo(() => {
        if (activeTab === 'all') return news;
        
        const keywords = FILTER_KEYWORDS[activeTab];
        return news.filter(item => {
            const text = `${item.title} ${item.content || ''}`.toLowerCase();
            return keywords.some(keyword => text.includes(keyword));
        });
    }, [news, activeTab]);

    const sendToAI = async (userPrompt: string, systemContext?: string) => {
        if (!userPrompt.trim() || aiLoading) return;

        const contextualPrompt = systemContext
            ? `${systemContext}\n\nUser question: ${userPrompt}`
            : userPrompt;

        setAiMessages(prev => [...prev, { role: 'user', content: userPrompt }]);
        setAiInput('');
        setAiLoading(true);

        try {
            const { data, error } = await supabase.functions.invoke('ai-chatbot', {
                body: {
                    message: contextualPrompt,
                    history: [{ role: 'user', content: TOURIST_SYSTEM_PROMPT }],
                }
            });

            if (error) throw error;
            
            // Add travel impact line to the response
            const impact = getTravelImpact(userPrompt + systemContext);
            const impactEmoji = impact === 'high' ? '🔴' : impact === 'moderate' ? '🟡' : '🟢';
            const impactText = impact === 'high' ? 'High Impact' : impact === 'moderate' ? 'Moderate Impact' : 'Low Impact';
            
            const formattedResponse = `**${impactEmoji} ${impactText}**\n\n${data.reply}`;
            
            setAiMessages(prev => [...prev, { role: 'assistant', content: formattedResponse }]);
        } catch {
            setAiMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Sorry, I had trouble reaching the AI right now. Please try again in a moment!'
            }]);
        } finally {
            setAiLoading(false);
        }
    };

    const handleSummarize = (item: NewsItem) => {
        const badgeType = getBadgeType(item);
        const context = `You are summarizing a news article for a tourist visiting Nepal.\n\nArticle title: "${item.title}"\nArticle link: ${item.link}\n${badgeType === 'emergency' ? '⚠️ This is an emergency/travel alert.\n' : ''}${badgeType === 'advisory' ? '⚠️ This is a political/advisory news.\n' : ''}${badgeType === 'safety' ? '⚠️ This is a safety-related news.\n' : ''}`;
        const prompt = `Please summarize this news article and tell me how it might affect my travels in Nepal.`;
        sendToAI(prompt, context);
        // Scroll to AI panel on mobile
        document.getElementById('ai-panel')?.scrollIntoView({ behavior: 'smooth' });
    };

    const emergencyCount = news.filter(n => getBadgeType(n) === 'emergency').length;

    return (
        <div className="min-h-screen bg-[#F7F1E8]">
            {/* Full-width Dark Hero Strip */}
            <div className="w-full bg-[#0F1923] py-6 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="font-serif text-2xl sm:text-3xl text-white tracking-wide">
                        Nepal Travel Intelligence
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">
                        Live updates filtered for travelers · Powered by OnlineKhabar
                    </p>
                </div>
            </div>

            {/* Tab Filter Bar */}
            <div className="w-full bg-white/50 backdrop-blur-sm border-b border-black/[0.06]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
                    <div className="flex items-center gap-2 overflow-x-auto">
                        {FILTER_TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                                    activeTab === tab.id
                                        ? 'bg-[#0F1923] text-white'
                                        : 'text-gray-600 border border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Top Bar */}
            <div className="sticky top-0 z-40 bg-[#F7F1E8]/95 backdrop-blur-sm border-b border-black/[0.06]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link to="/">
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-black/[0.06]">
                                <ArrowLeft className="w-5 h-5 text-[#0F1923]" />
                            </Button>
                        </Link>
                        <div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-xl bg-[#0F1923]/10 flex items-center justify-center">
                                <Newspaper className="w-5 h-5 text-[#0F1923]" />
                            </div>
                            <div>
                                <h1 className="font-bold text-lg leading-tight text-[#0F1923]">Insights / News</h1>
                                <p className="text-xs text-gray-500 leading-none">Live from OnlineKhabar</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {emergencyCount > 0 && (
                            <Badge className="gap-1 bg-red-500 hover:bg-red-600 text-white animate-pulse">
                                <Zap className="w-3 h-3" />
                                {emergencyCount} Alert{emergencyCount > 1 ? 's' : ''}
                            </Badge>
                        )}
                        {lastUpdated && (
                            <span className="text-xs text-gray-500 hidden sm:block">
                                Updated: {lastUpdated}
                            </span>
                        )}
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={handleRefresh} 
                            disabled={loading}
                            className="gap-1.5 h-8 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* News Grid */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-[#0F1923]">Latest Updates</h2>
                                <p className="text-sm text-gray-500">Filtered for travel-relevant news</p>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 border rounded-full px-3 py-1.5 bg-white shadow-sm">
                                <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                                Verified Source: OnlineKhabar
                            </div>
                        </div>

                        {loading && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="bg-white rounded-xl border border-black/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden animate-pulse">
                                        <div className="h-[180px] bg-gray-200" />
                                        <div className="p-5 space-y-3">
                                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                                            <div className="h-4 bg-gray-200 rounded w-1/2" />
                                            <div className="h-3 bg-gray-200 rounded w-1/4 mt-4" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {error && !loading && (
                            <div className="text-center py-16">
                                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                                <p className="text-lg font-semibold mb-2">Could not load news</p>
                                <p className="text-gray-500 mb-6">{error}</p>
                                <Button onClick={loadNews} className="bg-[#0F1923] hover:bg-[#1a2a35]">Try Again</Button>
                            </div>
                        )}

                        {!loading && !error && filteredNews.length === 0 && (
                            <div className="text-center py-16">
                                <Newspaper className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-lg font-semibold mb-2">No travel news right now</p>
                                <p className="text-gray-500">No articles matched the travel keywords at this time. Check back soon!</p>
                            </div>
                        )}

                        {!loading && !error && filteredNews.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <AnimatePresence>
                                    {filteredNews.map((item, index) => (
                                        <motion.div key={item.link} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07 }}>
                                            <NewsCard item={item} onSummarize={handleSummarize} />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>

                    {/* AI Summarizer Panel */}
                    <div id="ai-panel" className="w-full lg:w-[360px] flex-shrink-0">
                        <div className="sticky top-24">
                            <div className="bg-white border border-black/[0.08] rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col h-[560px]">
                                {/* Panel Header */}
                                <div className="bg-[#0F1923] p-4 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                        <Bot className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-serif text-white text-sm">Nepal News Buddy</h3>
                                        <p className="text-xs text-gray-400">AI-powered travel news assistant</p>
                                    </div>
                                    <Sparkles className="w-4 h-4 ml-auto text-yellow-400 animate-pulse" />
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                                    {aiMessages.map((msg, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                                        >
                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs ${
                                                msg.role === 'user' ? 'bg-[#E67E22] text-white' : 'bg-[#FFF4E8] text-[#0F1923]'
                                            }`}>
                                                {msg.role === 'user' ? '👤' : '🤖'}
                                            </div>
                                            <div className={`max-w-[80%] p-3 rounded-xl text-sm whitespace-pre-wrap leading-relaxed ${
                                                msg.role === 'user'
                                                    ? 'bg-[#E67E22] text-white rounded-tr-sm'
                                                    : 'bg-[#FFF4E8] text-gray-800 rounded-tl-sm'
                                            }`}>
                                                {msg.content.split('\n').map((line, idx) => (
                                                    <span key={idx} className="block">
                                                        {line.includes('🔴 High Impact') ? (
                                                            <span className="font-bold text-red-600">{line}</span>
                                                        ) : line.includes('🟡 Moderate Impact') ? (
                                                            <span className="font-bold text-amber-600">{line}</span>
                                                        ) : line.includes('🟢 Low Impact') ? (
                                                            <span className="font-bold text-green-600">{line}</span>
                                                        ) : (
                                                            line.replace(/\*\*(.*?)\*\*/g, '$1')
                                                        )}
                                                    </span>
                                                ))}
                                            </div>
                                        </motion.div>
                                    ))}
                                    {aiLoading && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2.5">
                                            <div className="w-7 h-7 rounded-full bg-[#FFF4E8] flex items-center justify-center">🤖</div>
                                            <div className="bg-[#FFF4E8] p-3 rounded-xl rounded-tl-sm">
                                                <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                                            </div>
                                        </motion.div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input */}
                                <div className="p-4 border-t border-gray-100 bg-white">
                                    <p className="text-xs text-gray-400 mb-2 text-center">
                                        👆 Click "AI Summary" on any article, or ask below
                                    </p>
                                    <div className="flex gap-2">
                                        <Input
                                            value={aiInput}
                                            onChange={(e) => setAiInput(e.target.value)}
                                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendToAI(aiInput); } }}
                                            placeholder="Ask about Nepal travel..."
                                            className="flex-1 text-sm h-9 border-gray-200 focus:border-[#E67E22] focus:ring-[#E67E22]"
                                            disabled={aiLoading}
                                        />
                                        <Button
                                            onClick={() => sendToAI(aiInput)}
                                            disabled={!aiInput.trim() || aiLoading}
                                            size="icon"
                                            className="h-9 w-9 flex-shrink-0 bg-[#E67E22] hover:bg-[#D35400] text-white transition-all duration-200 hover:shadow-[0_0_12px_rgba(230,126,34,0.4)]"
                                        >
                                            <Send className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Back to home below AI panel */}
                            <Link to="/" className="mt-4 flex items-center justify-center">
                                <Button variant="outline" className="w-full gap-2 mt-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50">
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Home
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            
            <style>{`
                @keyframes gentle-pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
                .animate-gentle-pulse {
                    animation: gentle-pulse 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default NewsPage;
