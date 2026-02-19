import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Newspaper, AlertTriangle, Clock, ExternalLink,
    Sparkles, Send, Bot, Loader2, RefreshCw, ShieldCheck
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

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
            className={`bg-card border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col ${item.isEmergency ? 'border-red-400 ring-2 ring-red-200' : 'border-border'
                }`}
        >
            {/* Thumbnail */}
            {item.thumbnail && (
                <div className="relative h-44 overflow-hidden">
                    <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = 'none'; }}
                    />
                    {item.isEmergency && (
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full animate-pulse">
                            <AlertTriangle className="w-3 h-3" />
                            EMERGENCY
                        </div>
                    )}
                </div>
            )}

            <div className="p-5 flex flex-col flex-1">
                {/* Emergency badge when no image */}
                {item.isEmergency && !item.thumbnail && (
                    <div className="flex items-center gap-1.5 bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded-full mb-3 self-start animate-pulse">
                        <AlertTriangle className="w-3 h-3" />
                        EMERGENCY ALERT
                    </div>
                )}

                {/* Title */}
                <h3 className={`font-semibold text-base leading-snug mb-3 line-clamp-3 ${item.isEmergency ? 'text-red-700' : 'text-foreground'
                    }`}>
                    {item.title}
                </h3>

                {/* Footer */}
                <div className="mt-auto flex items-center justify-between pt-3 border-t border-border/50">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {formattedDate}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onSummarize(item)}
                            className="text-xs h-7 px-2 text-primary hover:bg-primary/10 gap-1"
                        >
                            <Sparkles className="w-3 h-3" />
                            AI Summary
                        </Button>
                        <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
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

const NewsPage = () => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<string>('');
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
            setLastUpdated(new Date().toLocaleTimeString());
        } catch {
            setError('Could not load news. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadNews(); }, []);

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
            setAiMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
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
        const context = `You are summarizing a news article for a tourist visiting Nepal.\n\nArticle title: "${item.title}"\nArticle link: ${item.link}\n${item.isEmergency ? '⚠️ This is an emergency alert.\n' : ''}`;
        const prompt = `Please summarize this news article and tell me how it might affect my travels in Nepal.`;
        sendToAI(prompt, context);
        // Scroll to AI panel on mobile
        document.getElementById('ai-panel')?.scrollIntoView({ behavior: 'smooth' });
    };

    const emergencyCount = news.filter(n => n.isEmergency).length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background">
            {/* Header */}
            <div className="sticky top-0 z-40 glass-effect shadow-sm border-b border-border/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link to="/">
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Newspaper className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h1 className="font-bold text-lg leading-tight">Nepal Travel News</h1>
                                <p className="text-xs text-muted-foreground leading-none">Live from OnlineKhabar</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {emergencyCount > 0 && (
                            <Badge variant="destructive" className="gap-1 animate-pulse">
                                <AlertTriangle className="w-3 h-3" />
                                {emergencyCount} Alert{emergencyCount > 1 ? 's' : ''}
                            </Badge>
                        )}
                        {lastUpdated && (
                            <span className="text-xs text-muted-foreground hidden sm:block">
                                Updated: {lastUpdated}
                            </span>
                        )}
                        <Button variant="outline" size="sm" onClick={loadNews} disabled={loading} className="gap-1.5 h-8">
                            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
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
                                <h2 className="text-xl font-bold">Latest Updates</h2>
                                <p className="text-sm text-muted-foreground">Filtered for travel-relevant news</p>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground border rounded-full px-3 py-1.5 bg-card">
                                <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                                Verified Source: OnlineKhabar
                            </div>
                        </div>

                        {loading && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="bg-card rounded-2xl border border-border overflow-hidden animate-pulse">
                                        <div className="h-44 bg-muted" />
                                        <div className="p-5 space-y-3">
                                            <div className="h-4 bg-muted rounded w-3/4" />
                                            <div className="h-4 bg-muted rounded w-1/2" />
                                            <div className="h-3 bg-muted rounded w-1/4 mt-4" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {error && !loading && (
                            <div className="text-center py-16">
                                <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
                                <p className="text-lg font-semibold mb-2">Could not load news</p>
                                <p className="text-muted-foreground mb-6">{error}</p>
                                <Button onClick={loadNews}>Try Again</Button>
                            </div>
                        )}

                        {!loading && !error && news.length === 0 && (
                            <div className="text-center py-16">
                                <Newspaper className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-lg font-semibold mb-2">No travel news right now</p>
                                <p className="text-muted-foreground">No articles matched the travel keywords at this time. Check back soon!</p>
                            </div>
                        )}

                        {!loading && !error && news.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <AnimatePresence>
                                    {news.map((item, index) => (
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
                            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg flex flex-col h-[560px]">
                                {/* Panel Header */}
                                <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                                        <Bot className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-sm">Nepal News Buddy</h3>
                                        <p className="text-xs text-primary-foreground/70">AI-powered travel news assistant</p>
                                    </div>
                                    <Sparkles className="w-4 h-4 ml-auto text-yellow-300 animate-pulse" />
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {aiMessages.map((msg, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                                        >
                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-accent/20 text-accent'
                                                }`}>
                                                {msg.role === 'user' ? '👤' : '🤖'}
                                            </div>
                                            <div className={`max-w-[80%] p-3 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed ${msg.role === 'user'
                                                ? 'bg-primary text-primary-foreground rounded-tr-none'
                                                : 'bg-secondary text-foreground rounded-tl-none'
                                                }`}>
                                                {msg.content.replace(/\*\*(.*?)\*\*/g, '$1')}
                                            </div>
                                        </motion.div>
                                    ))}
                                    {aiLoading && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2.5">
                                            <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center">🤖</div>
                                            <div className="bg-secondary p-3 rounded-2xl rounded-tl-none">
                                                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                                            </div>
                                        </motion.div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input */}
                                <div className="p-4 border-t border-border bg-muted/30">
                                    <p className="text-xs text-muted-foreground mb-2 text-center">
                                        👆 Click "AI Summary" on any article, or ask below
                                    </p>
                                    <div className="flex gap-2">
                                        <Input
                                            value={aiInput}
                                            onChange={(e) => setAiInput(e.target.value)}
                                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendToAI(aiInput); } }}
                                            placeholder="Ask about Nepal travel..."
                                            className="flex-1 text-sm h-9"
                                            disabled={aiLoading}
                                        />
                                        <Button
                                            onClick={() => sendToAI(aiInput)}
                                            disabled={!aiInput.trim() || aiLoading}
                                            size="icon"
                                            className="btn-primary h-9 w-9 flex-shrink-0"
                                        >
                                            <Send className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Back to home below AI panel */}
                            <Link to="/" className="mt-4 flex items-center justify-center">
                                <Button variant="outline" className="w-full gap-2 mt-2">
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Home
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsPage;
