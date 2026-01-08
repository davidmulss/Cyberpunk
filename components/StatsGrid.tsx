import React from 'react';
import { AssetData } from '../types';

interface StatsGridProps {
  asset: AssetData;
}

interface StatItemProps {
  label: string;
  value: string;
  delay?: number;
}

const StatItem: React.FC<StatItemProps> = ({ label, value, delay = 0 }) => (
  <div 
    className="relative flex flex-col p-4 bg-cyber-gray/20 border-l border-cyber-cyan/30 hover:bg-cyber-cyan/5 hover:border-cyber-cyan transition-all duration-300 group overflow-hidden"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-1 h-1 bg-cyber-cyan shadow-neon-cyan"></div>
    </div>
    <span className="text-cyber-cyan/60 text-[10px] font-mono uppercase tracking-widest mb-1 group-hover:text-cyber-cyan transition-colors">
        {label}
    </span>
    <span className="text-white font-display font-medium text-lg tracking-wide truncate group-hover:text-white group-hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.5)] transition-all">
        {value}
    </span>
  </div>
);

const StatsGrid: React.FC<StatsGridProps> = ({ asset }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <StatItem label="Mkt Cap" value={asset.marketCap} delay={0} />
      <StatItem label="24h Vol" value={asset.volume} delay={100} />
      <StatItem label="P/E Ratio" value={asset.peRatio} delay={200} />
      <StatItem label="52W Range" value={asset.weekRange} delay={300} />
      <StatItem label="50-Day MA" value={asset.movingAverage50d} delay={400} />
      <StatItem label="200-Day MA" value={asset.movingAverage200d} delay={500} />
      {asset.stats && asset.stats.map((stat, idx) => (
          <StatItem key={idx} label={stat.label} value={stat.value} delay={600 + (idx * 100)} />
      ))}
    </div>
  );
};

export default StatsGrid;
