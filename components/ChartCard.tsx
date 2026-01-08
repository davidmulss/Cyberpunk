import React, { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { Settings, BarChart2, Activity, Maximize2 } from 'lucide-react';
import { ChartPoint } from '../types';

interface ChartCardProps {
  data24H: ChartPoint[];
  data7D: ChartPoint[];
  data1M: ChartPoint[];
  data1Y: ChartPoint[];
  data5Y: ChartPoint[];
  isPositive: boolean;
}

type Timeframe = '24H' | '7D' | '1M' | '1Y' | '5Y';
type ChartType = 'AREA' | 'LINE';

const ChartCard: React.FC<ChartCardProps> = ({ data24H, data7D, data1M, data1Y, data5Y, isPositive }) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('24H');
  const [useLogScale, setUseLogScale] = useState(false);
  const [chartType, setChartType] = useState<ChartType>('AREA');
  
  // Cyberpunk colors
  const color = isPositive ? '#00f3ff' : '#ff00ff'; 
  const colorDim = isPositive ? 'rgba(0, 243, 255, 0.1)' : 'rgba(255, 0, 255, 0.1)';

  const getData = () => {
    switch (timeframe) {
      case '24H': return data24H || [];
      case '7D': return data7D || [];
      case '1Y': return data1Y || [];
      case '5Y': return data5Y || [];
      case '1M':
      default: return data1M || [];
    }
  };

  const data = getData();
  
  // Calculate Min/Max for dynamic domain
  const { min, max } = useMemo(() => {
    if (data.length === 0) return { min: 0, max: 0 };
    const values = data.map(d => d.value);
    return {
        min: Math.min(...values),
        max: Math.max(...values)
    };
  }, [data]);

  // Buffer for chart domain to prevent lines hitting the edges
  const domainMin = useLogScale ? 'auto' : min * 0.99;
  const domainMax = useLogScale ? 'auto' : max * 1.01;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-cyber-black/90 border border-cyber-cyan/30 p-3 shadow-neon-cyan backdrop-blur-md">
          <p className="text-gray-400 font-mono text-xs mb-1">{label}</p>
          <p className="text-white font-display font-bold text-lg" style={{ color: color }}>
            ${payload[0].value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative bg-cyber-gray/30 border border-cyber-cyan/30 p-1 backdrop-blur-sm group overflow-hidden flex flex-col h-[500px]">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,243,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,243,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

      {/* Header Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 relative z-20 gap-4">
        
        {/* Title & Status */}
        <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${isPositive ? 'bg-cyber-cyan shadow-neon-cyan' : 'bg-cyber-pink shadow-neon-pink'} animate-pulse`}></div>
            <div>
                <h3 className="text-white font-display text-sm tracking-widest flex items-center gap-2">
                    MARKET_ACTION <span className="text-cyber-cyan/50">//</span> {timeframe}
                </h3>
                <div className="flex gap-4 mt-1 font-mono text-[10px] text-gray-400">
                    <span>H: <span className="text-gray-200">${max.toLocaleString()}</span></span>
                    <span>L: <span className="text-gray-200">${min.toLocaleString()}</span></span>
                </div>
            </div>
        </div>
        
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4">
             {/* Options */}
             <div className="flex items-center bg-cyber-black/50 border border-gray-800 rounded-sm p-1">
                <button 
                    onClick={() => setChartType(prev => prev === 'AREA' ? 'LINE' : 'AREA')}
                    className={`p-1.5 hover:bg-cyber-cyan/20 rounded-sm transition-colors ${chartType === 'AREA' ? 'text-cyber-cyan' : 'text-gray-500'}`}
                    title="Toggle Chart Type"
                >
                    <Activity className="w-3 h-3" />
                </button>
                <div className="w-[1px] h-3 bg-gray-800 mx-1"></div>
                <button 
                    onClick={() => setUseLogScale(!useLogScale)}
                    className={`px-2 py-0.5 text-[10px] font-mono hover:bg-cyber-cyan/20 rounded-sm transition-colors ${useLogScale ? 'text-cyber-cyan bg-cyber-cyan/10' : 'text-gray-500'}`}
                    title="Toggle Log Scale"
                >
                    LOG
                </button>
            </div>

            {/* Timeframe Selector */}
            <div className="flex bg-cyber-black/50 border border-gray-800 rounded-sm p-1">
            {(['24H', '7D', '1M', '1Y', '5Y'] as Timeframe[]).map((tf) => (
                <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 text-[10px] font-mono transition-all duration-200 rounded-sm relative overflow-hidden ${
                    timeframe === tf
                    ? 'text-black font-bold'
                    : 'text-gray-500 hover:text-cyber-cyan'
                }`}
                >
                {timeframe === tf && (
                    <div className={`absolute inset-0 ${isPositive ? 'bg-cyber-cyan' : 'bg-cyber-pink'} opacity-90`}></div>
                )}
                <span className="relative z-10">{tf}</span>
                </button>
            ))}
            </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="flex-grow w-full relative z-10 px-2 pb-2">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'AREA' ? (
              <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a2e" vertical={false} />
                <XAxis 
                    dataKey="date" 
                    stroke="#4b5563" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    minTickGap={40}
                    tick={{ fill: '#4b5563', fontFamily: 'Share Tech Mono' }}
                />
                <YAxis 
                    stroke="#4b5563" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    scale={useLogScale ? 'log' : 'linear'}
                    domain={[domainMin, domainMax]}
                    tickFormatter={(value) => `$${value.toLocaleString(undefined, { notation: "compact" })}`}
                    tick={{ fill: '#4b5563', fontFamily: 'Share Tech Mono' }}
                    width={40}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                  animationDuration={1000}
                />
              </AreaChart>
          ) : (
            <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a2e" vertical={false} />
                <XAxis 
                    dataKey="date" 
                    stroke="#4b5563" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    minTickGap={40}
                    tick={{ fill: '#4b5563', fontFamily: 'Share Tech Mono' }}
                />
                <YAxis 
                    stroke="#4b5563" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    scale={useLogScale ? 'log' : 'linear'}
                    domain={[domainMin, domainMax]}
                    tickFormatter={(value) => `$${value.toLocaleString(undefined, { notation: "compact" })}`}
                    tick={{ fill: '#4b5563', fontFamily: 'Share Tech Mono' }}
                    width={40}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: color, stroke: '#000' }}
                  animationDuration={1000}
                />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Decorative Chart Frame Elements */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyber-cyan/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyber-cyan/30 to-transparent"></div>
    </div>
  );
};

export default ChartCard;
