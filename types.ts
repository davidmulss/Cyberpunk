export interface ChartPoint {
  date: string;
  value: number;
}

export interface KeyStat {
  label: string;
  value: string;
}

export interface NewsItem {
  title: string;
  source: string;
  time: string;
  url: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  isBreaking: boolean;
}

export interface AssetData {
  symbol: string;
  name: string;
  price: number;
  currency: string;
  changePercent: number;
  changeValue: number;
  marketCap: string;
  volume: string;
  peRatio: string;
  weekRange: string;
  movingAverage50d: string;
  movingAverage200d: string;
  description: string;
  
  // New Forecast Fields
  analystRating: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell';
  priceTarget: string;
  forecastDescription: string;
  
  chartData24H: ChartPoint[];
  chartData7D: ChartPoint[];
  chartData1M: ChartPoint[];
  chartData1Y: ChartPoint[];
  chartData5Y: ChartPoint[];
  stats: KeyStat[];
}

export interface GroundingSource {
  title: string;
  url: string;
}

export interface ApiResponse {
  asset: AssetData | null;
  sources: GroundingSource[];
  error?: string;
}
