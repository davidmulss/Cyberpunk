import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Cpu, Activity } from 'lucide-react';
import SearchBar from './components/SearchBar';
import ChartCard from './components/ChartCard';
import StatsGrid from './components/StatsGrid';
import AnalysisSection from './components/AnalysisSection';
import LoadingState from './components/LoadingState';
import NewsFeed from './components/NewsFeed';
import { fetchAssetInformation, fetchMarketNews } from './services/geminiService';
import { AssetData, GroundingSource, NewsItem } from './types';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<AssetData | null>(null);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  
  // News State
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isNewsLoading, setIsNewsLoading] = useState(true);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const loadNews = async (isBackgroundRefresh = false) => {
        try {
            if (!isBackgroundRefresh) setIsNewsLoading(true);
            
            const headlines = await fetchMarketNews();
            
            // Only update if we got data back
            if (headlines && headlines.length > 0) {
              setNews(headlines);
            }
        } catch (e) {
            console.error("News uplink failed");
        } finally {
            if (!isBackgroundRefresh) setIsNewsLoading(false);
        }
    };

    // Initial load
    loadNews();

    // Auto-refresh every 60 seconds to catch breaking news
    intervalId = setInterval(() => {
        loadNews(true); // background refresh
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError(null);
    setData(null);
    setHasSearched(true);

    try {
      const result = await fetchAssetInformation(query);
      if (result.error) {
        setError(result.error);
      } else {
        setData(result.asset);
        setSources(result.sources);
      }
    } catch (e) {
      setError("SYSTEM MALFUNCTION. RETRY INITIATED.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen selection:bg-cyber-cyan selection:text-black overflow-x-hidden">
      {/* Header / Nav */}
      <header className="sticky top-0 z-50 bg-cyber-black/80 backdrop-blur-md border-b border-cyber-cyan/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => { setData(null); setHasSearched(false); setError(null); }}>
            <div className="w-10 h-10 border border-cyber-cyan bg-cyber-cyan/10 flex items-center justify-center relative overflow-hidden group-hover:shadow-neon-cyan transition-all duration-300">
              <Cpu className="w-6 h-6 text-cyber-cyan relative z-10" />
              <div className="absolute inset-0 bg-cyber-cyan/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </div>
            <span className="text-2xl font-display font-bold text-white tracking-widest group-hover:text-cyber-cyan transition-colors">
              CYBERPUNK <span className="text-cyber-cyan">INVEST</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-xs font-mono text-cyber-cyan/60">
             <span>SYS.STATUS: ONLINE</span>
             <span>V.3.1.0</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        {/* Decorative Background Elements */}
        <div className="fixed top-20 left-0 w-64 h-64 bg-cyber-purple/20 rounded-full blur-[100px] pointer-events-none -z-10"></div>
        <div className="fixed bottom-0 right-0 w-96 h-96 bg-cyber-cyan/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
        
        {/* Landing View: Search + News Split */}
        {!hasSearched && (
            <div className="min-h-[70vh] flex items-center">
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left: Hero & Search */}
                    <div className="space-y-10 animate-fade-in">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 border border-cyber-cyan/30 rounded-none bg-cyber-cyan/5 text-cyber-cyan text-xs font-mono tracking-widest">
                                <Activity className="w-3 h-3" />
                                NEURAL MARKET LINK ESTABLISHED
                            </div>
                            <h1 className="text-5xl md:text-7xl font-display font-black text-white tracking-tight uppercase leading-none">
                                Market <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-purple drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]">Intelligence</span>
                            </h1>
                            <p className="text-cyber-cyan/60 text-lg max-w-lg font-light border-l-2 border-cyber-pink pl-4">
                                Decrypt real-time assets. Powered by Gemini 2.0 Neural Net.
                            </p>
                        </div>
                        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
                    </div>

                    {/* Right: News Feed (Desktop only) */}
                    <div className="hidden lg:block h-full animate-fade-in delay-150">
                        <NewsFeed news={news} isLoading={isNewsLoading} />
                    </div>
                </div>
            </div>
        )}

        {/* Dashboard View */}
        {hasSearched && (
            <div className="animate-fade-in">
                {/* Compact Search Header */}
                <div className="mb-8 max-w-2xl">
                    <SearchBar onSearch={handleSearch} isLoading={isLoading} />
                </div>

                {/* Error State */}
                {error && (
                    <div className="max-w-3xl mx-auto p-4 bg-red-900/20 border border-red-500 text-red-400 font-mono text-center animate-pulse mb-8">
                        <span className="mr-2">[ERROR]</span>{error}
                    </div>
                )}

                {/* Loading State */}
                {isLoading && <LoadingState />}

                {/* Data Display */}
                {!isLoading && data && (
                <div className="space-y-8">
                    {/* Top Bar: Price & Identity */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-cyber-cyan/20">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-widest">{data.symbol}</h1>
                        <span className="px-3 py-1 bg-cyber-cyan/10 border border-cyber-cyan/50 text-cyber-cyan text-xs font-mono uppercase tracking-widest">
                            {data.name}
                        </span>
                        </div>
                        <p className="text-gray-400 text-sm max-w-2xl font-light leading-relaxed border-l-2 border-cyber-cyan/30 pl-4">{data.description}</p>
                    </div>
                    
                    <div className="flex flex-col items-end">
                        <div className="text-5xl md:text-6xl font-display font-bold text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                        {data.currency === 'USD' ? '$' : ''}{data.price.toLocaleString()}
                        <span className="text-xl text-cyber-cyan/50 font-mono ml-2">{data.currency}</span>
                        </div>
                        <div className={`flex items-center gap-2 font-mono text-lg mt-2 ${data.changePercent >= 0 ? 'text-cyber-cyan drop-shadow-[0_0_8px_rgba(0,243,255,0.5)]' : 'text-cyber-pink drop-shadow-[0_0_8px_rgba(255,0,255,0.5)]'}`}>
                        {data.changePercent >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                        <span>{data.changePercent > 0 ? '+' : ''}{data.changePercent}%</span>
                        <span className="opacity-60 text-sm">[{data.changeValue > 0 ? '+' : ''}{data.changeValue}]</span>
                        </div>
                    </div>
                    </div>

                    {/* Stats Grid */}
                    <StatsGrid asset={data} />

                    {/* Main Content Grid: Chart & Analysis */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Chart (Takes up 2 cols) */}
                    <div className="lg:col-span-2 space-y-6">
                        <ChartCard 
                        data24H={data.chartData24H}
                        data7D={data.chartData7D}
                        data1M={data.chartData1M} 
                        data1Y={data.chartData1Y} 
                        data5Y={data.chartData5Y} 
                        isPositive={data.changePercent >= 0} 
                        />
                    </div>

                    {/* Right Column: AI Analysis */}
                    <div className="lg:col-span-1">
                        <AnalysisSection 
                            analysis={data.forecastDescription} 
                            rating={data.analystRating}
                            priceTarget={data.priceTarget}
                            sources={sources} 
                        />
                    </div>
                    </div>

                </div>
                )}
            </div>
        )}

      </main>
    </div>
  );
};

export default App;
