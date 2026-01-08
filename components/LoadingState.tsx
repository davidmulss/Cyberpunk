import React from 'react';
import { Loader2, Wifi } from 'lucide-react';

const LoadingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] relative">
      <div className="relative">
        <div className="absolute inset-0 bg-cyber-cyan/20 blur-xl rounded-full"></div>
        <Loader2 className="w-16 h-16 animate-spin text-cyber-cyan relative z-10" />
      </div>
      
      <div className="mt-8 text-center space-y-2">
        <h3 className="text-2xl font-display font-bold text-white tracking-widest animate-pulse">
            ESTABLISHING UPLINK...
        </h3>
        <div className="flex items-center justify-center gap-2 text-cyber-cyan/60 font-mono text-sm">
            <Wifi className="w-4 h-4 animate-pulse" />
            <span>ENCRYPTING DATA STREAM</span>
        </div>
      </div>
      
      {/* Decorative scanning line */}
      <div className="absolute inset-x-0 top-1/2 h-[1px] bg-cyber-cyan/20 w-full animate-pulse"></div>
    </div>
  );
};

export default LoadingState;
