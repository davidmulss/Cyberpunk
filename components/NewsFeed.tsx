import React from 'react';
import { ExternalLink, Zap, TrendingUp, TrendingDown, Minus, RefreshCw } from 'lucide-react';
import { NewsItem } from '../types';

interface NewsFeedProps {
  news: NewsItem[];
  isLoading: boolean;
}

const NewsFeed: React.FC<NewsFeedProps> = ({ news, isLoading }) => {
  if (isLoading) {
    return (
        <div className="border border-cyber-cyan/30 bg-cyber-black/50 p-6 h-full min-h-[400px] animate-pulse">
            <div className="flex items-center gap-2 mb-6 text-cyber-cyan/50">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-mono tracking-widest">UPLINKING GLOBAL FEEDS...</span>
            </div>
            {[1,2,3,4].map(i => (
                <div key={i} className="mb-6 space-y-2">
                    <div className="h-4 bg-cyber-cyan/10 w-3/4"></div>
                    <div className="h-3 bg-cyber-cyan/5 w-1/2"></div>
                </div>
            ))}
        </div>
    );
  }

  if (news.length === 0) return null;

  return (
    <div className="border-l-2 border-cyber-cyan/30 pl-8 h-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-cyber-pink shadow-neon-pink animate-pulse rounded-full"></div>
            <h2 className="text-xl font-display text-white tracking-widest">
                DAILY <span className="text-cyber-cyan">INTELLIGENCE</span>
            </h2>
        </div>
        <div className="flex items-center gap-2 text-cyber-cyan/40 text-[10px] font-mono animate-pulse">
            <RefreshCw className="w-3 h-3" />
            <span>AUTO-REFRESH: ON</span>
        </div>
      </div>

      <div className="space-y-6">
        {news.map((item, idx) => (
          <div key={idx} className={`group relative p-3 transition-all duration-300 ${item.isBreaking ? 'bg-red-900/10 border-l border-red-500' : 'hover:bg-cyber-gray/30'}`}>
            
            {item.isBreaking ? (
                <div className="absolute -right-2 -top-2 px-2 py-0.5 bg-red-600 text-white text-[9px] font-bold font-display tracking-widest animate-pulse shadow-neon-pink z-10">
                    BREAKING
                </div>
            ) : (
                <div className="absolute -left-[37px] top-5 w-2 h-2 bg-cyber-gray border border-cyber-cyan/50 rounded-full group-hover:bg-cyber-cyan transition-colors"></div>
            )}
            
            <a href={item.url || '#'} target="_blank" rel="noopener noreferrer" className="block group-hover:translate-x-1 transition-transform duration-300">
                <div className="flex items-start justify-between gap-4 mb-1">
                    <h3 className={`font-medium leading-tight transition-colors ${item.isBreaking ? 'text-white drop-shadow-[0_0_3px_rgba(255,0,0,0.5)]' : 'text-gray-200 group-hover:text-cyber-cyan'}`}>
                        {item.title}
                    </h3>
                    {item.sentiment === 'positive' && <TrendingUp className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                    {item.sentiment === 'negative' && <TrendingDown className="w-4 h-4 text-rose-400 flex-shrink-0" />}
                    {item.sentiment === 'neutral' && <Minus className="w-4 h-4 text-gray-500 flex-shrink-0" />}
                </div>
                
                <div className="flex items-center gap-3 text-xs font-mono text-gray-500 mt-2">
                    <span className="text-cyber-pink/80">{item.source}</span>
                    <span className={item.isBreaking ? 'text-red-400 font-bold' : ''}>{item.time}</span>
                    {item.url && <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
                </div>
            </a>
          </div>
        ))}
      </div>
      
      <div className="mt-8 pt-4 border-t border-dashed border-cyber-gray">
        <div className="text-[10px] font-mono text-gray-600 text-center">
            END OF STREAM // UPDATING IN REAL-TIME
        </div>
      </div>
    </div>
  );
};

export default NewsFeed;
