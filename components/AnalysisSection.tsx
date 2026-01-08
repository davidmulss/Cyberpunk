import React from 'react';
import { Cpu, ExternalLink, Zap, Target, TrendingUp } from 'lucide-react';
import { GroundingSource } from '../types';

interface AnalysisSectionProps {
  analysis: string; // This will now be the forecast description
  rating: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell';
  priceTarget: string;
  sources: GroundingSource[];
}

const AnalysisSection: React.FC<AnalysisSectionProps> = ({ analysis, rating, priceTarget, sources }) => {
  
  const getRatingColor = (r: string) => {
    switch(r) {
        case 'Strong Buy':
        case 'Buy': return 'text-cyber-cyan border-cyber-cyan shadow-neon-cyan';
        case 'Strong Sell':
        case 'Sell': return 'text-cyber-pink border-cyber-pink shadow-neon-pink';
        case 'Hold': return 'text-yellow-400 border-yellow-400 shadow-[0_0_5px_#facc15]';
        default: return 'text-white border-white';
    }
  };

  const colorClass = getRatingColor(rating);
  const baseColor = rating.includes('Buy') ? 'cyber-cyan' : rating.includes('Sell') ? 'cyber-pink' : 'yellow-400';

  return (
    <div className="h-full bg-cyber-gray/20 border border-cyber-purple/30 p-6 relative overflow-hidden group flex flex-col">
        
        {/* Glowing border animation */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyber-purple via-cyber-pink to-cyber-purple opacity-50"></div>
        
        <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-cyber-purple/10 rounded-sm border border-cyber-purple/50">
                <Target className="w-5 h-5 text-cyber-purple" />
            </div>
            <h3 className="text-white font-display text-lg tracking-widest">
                ANALYST <span className="text-cyber-purple">CONSENSUS</span>
            </h3>
        </div>

        {/* Signal Meter */}
        <div className="mb-6 flex items-center justify-between bg-cyber-black/40 p-4 border border-cyber-purple/20">
            <div>
                <span className="text-xs text-gray-500 font-mono tracking-widest block mb-1">SIGNAL</span>
                <span className={`text-2xl font-display font-bold px-3 py-1 border ${colorClass} bg-${baseColor}/10`}>
                    {rating.toUpperCase()}
                </span>
            </div>
            <div className="text-right">
                <span className="text-xs text-gray-500 font-mono tracking-widest block mb-1">PRICE TARGET</span>
                <div className="flex items-center justify-end gap-2 text-white">
                    <TrendingUp className="w-4 h-4 text-cyber-cyan" />
                    <span className="text-xl font-mono font-bold">{priceTarget}</span>
                </div>
            </div>
        </div>
      
        <div className="relative flex-grow">
            <div className="absolute -left-4 top-0 bottom-0 w-[2px] bg-cyber-purple/20"></div>
            <p className="text-gray-300 leading-relaxed text-sm font-sans tracking-wide">
                <span className="text-cyber-cyan font-mono text-xs block mb-2 opacity-70">INSTITUTIONAL FORECAST //</span>
                {analysis}
            </p>
        </div>

      {sources.length > 0 && (
        <div className="mt-8 pt-4 border-t border-dashed border-cyber-purple/30">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-3 h-3 text-cyber-pink" />
            <h4 className="text-[10px] font-mono font-bold text-cyber-pink uppercase tracking-widest">
                Data Sources (Yahoo Finance +)
            </h4>
          </div>
          <div className="flex flex-col gap-2">
            {sources.map((source, idx) => (
              <a
                key={idx}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between group/link px-3 py-2 bg-cyber-black border border-gray-800 hover:border-cyber-pink/50 transition-all duration-300"
              >
                <span className="text-xs text-gray-400 font-mono truncate max-w-[200px] group-hover/link:text-cyber-pink transition-colors">
                    {source.title}
                </span>
                <ExternalLink className="w-3 h-3 text-gray-600 group-hover/link:text-cyber-pink transition-colors" />
              </a>
            ))}
          </div>
        </div>
      )}
      
      {/* Background Decor */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-cyber-purple/10 rounded-full blur-3xl pointer-events-none"></div>
    </div>
  );
};

export default AnalysisSection;
