import React, { useState } from 'react';
import { Search, ChevronRight } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto">
      <div className={`relative group transition-all duration-300 ${isFocused ? 'scale-[1.02]' : 'scale-100'}`}>
        
        {/* Glowing border effect */}
        <div className={`absolute -inset-0.5 bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink rounded-none opacity-50 blur transition duration-500 ${isFocused ? 'opacity-100 blur-md' : 'opacity-30'}`}></div>
        
        <div className="relative flex items-center bg-cyber-black border border-cyber-cyan/50 p-1">
            <div className="pl-4 pr-3 flex items-center pointer-events-none text-cyber-cyan font-mono">
                <span className="mr-2 text-cyber-pink">{'>'}</span>
                <span className="text-xs tracking-widest opacity-70">QUERY:</span>
            </div>
            
            <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="ENTER_ASSET_ID..."
            className="block w-full py-4 bg-transparent text-white placeholder-cyber-gray font-mono focus:outline-none text-lg tracking-wide uppercase"
            disabled={isLoading}
            autoComplete="off"
            />
            
            <div className="pr-2">
                <button 
                    type="submit"
                    disabled={!input || isLoading}
                    className="px-6 py-2 bg-cyber-cyan/10 hover:bg-cyber-cyan text-cyber-cyan hover:text-black border border-cyber-cyan/50 font-display font-bold text-sm tracking-widest transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-neon-cyan"
                >
                    {isLoading ? 'SCANNING...' : 'EXECUTE'}
                </button>
            </div>
        </div>

        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyber-cyan"></div>
        <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyber-cyan"></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyber-cyan"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyber-cyan"></div>
      </div>
    </form>
  );
};

export default SearchBar;
