import React, { useEffect, useState } from 'react';
import { TrendingUp, Activity, BarChart2, Layers, Bookmark, Calculator, Clock, ShieldAlert, Zap } from 'lucide-react';

interface HeaderProps {
  activeTab: 'analyze' | 'options' | 'market-pulse' | 'comparator' | 'calculator' | 'watchlist';
  setActiveTab: (tab: 'analyze' | 'options' | 'market-pulse' | 'comparator' | 'calculator' | 'watchlist') => void;
  watchlistCount: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, watchlistCount }) => {
  const [istTime, setIstTime] = useState<string>('');
  const [isMarketOpen, setIsMarketOpen] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // IST is UTC+5:30
      const istDate = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
      const hours = istDate.getHours();
      const minutes = istDate.getMinutes();
      const day = istDate.getDay(); // 0 is Sunday, 6 is Saturday

      const formatted = istDate.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
      setIstTime(formatted);

      // NSE/BSE Market open: Mon-Fri 09:15 to 15:30 IST
      const isWeekday = day >= 1 && day <= 5;
      const currentMinutes = hours * 60 + minutes;
      const marketOpenMinutes = 9 * 60 + 15;
      const marketCloseMinutes = 15 * 60 + 30;

      setIsMarketOpen(isWeekday && currentMinutes >= marketOpenMinutes && currentMinutes <= marketCloseMinutes);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-gradient-to-r from-[#111318] via-[#0d0f14] to-[#08090b] border-b border-slate-800 shadow-2xl sticky top-0 z-40 backdrop-blur-md">
      {/* Top Bar with NSE/BSE Ticker strip & IST Market Clock */}
      <div className="border-b border-slate-800/60 bg-[#050608]/80 px-4 sm:px-8 py-2 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-6 overflow-x-auto scrollbar-none py-0.5">
            <div className="flex items-baseline gap-2">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Nifty 50</span>
              <span className="text-green-400 font-mono font-bold text-xs">
                24,680.50 <span className="text-[10px] text-green-500 font-semibold">+0.48%</span>
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Bank Nifty</span>
              <span className="text-green-400 font-mono font-bold text-xs">
                51,450.20 <span className="text-[10px] text-green-500 font-semibold">+0.22%</span>
              </span>
            </div>
            <div className="flex items-baseline gap-2 hidden md:flex">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Sensex</span>
              <span className="text-green-400 font-mono font-bold text-xs">
                81,120.30 <span className="text-[10px] text-green-500 font-semibold">+0.41%</span>
              </span>
            </div>
            <div className="flex items-baseline gap-2 hidden lg:flex">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">India VIX</span>
              <span className="text-amber-400 font-mono font-bold text-xs">
                13.45 <span className="text-[10px] text-slate-400 font-normal">(Low Risk)</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 ml-auto">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] border border-slate-800 bg-[#0d0f14]">
              <span className={`w-1.5 h-1.5 rounded-full ${isMarketOpen ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`}></span>
              <span className={isMarketOpen ? 'text-green-400 font-medium' : 'text-slate-400 font-medium'}>
                {isMarketOpen ? 'Market Live' : 'Market Closed'}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>{istTime || '09:15:00 AM'} IST</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header & Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.5)] shrink-0">
            <span className="text-white font-black text-xl tracking-tighter">B</span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white uppercase">
                BullsEye <span className="text-indigo-400">Terminal</span>
              </h1>
              <span className="px-2 py-0.5 rounded border border-slate-700 bg-slate-900 text-[10px] text-slate-400 font-mono">
                v4.2.0-STABLE
              </span>
              <span className="px-2 py-0.5 rounded border border-indigo-900/50 bg-indigo-950/40 text-[10px] text-indigo-300 font-mono">
                NSE • BSE
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Quantitative Intelligence & Risk Execution Architecture
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <nav className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1 bg-[#08090b] p-1.5 rounded-xl border border-slate-800">
          <button
            id="nav-tab-analyze"
            onClick={() => setActiveTab('analyze')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'analyze'
                ? 'bg-indigo-600 text-white shadow-[0_0_10px_rgba(79,70,229,0.4)] font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#111318]'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            Stock Deep Scan
          </button>

          <button
            id="nav-tab-options"
            onClick={() => setActiveTab('options')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap relative ${
              activeTab === 'options'
                ? 'bg-indigo-600 text-white shadow-[0_0_10px_rgba(79,70,229,0.4)] font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#111318]'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-yellow-400" />
            Option Trading Signals
            <span className="px-1.5 py-0.2 rounded bg-yellow-400 text-slate-950 text-[9px] font-black uppercase">
              F&O
            </span>
          </button>

          <button
            id="nav-tab-market-pulse"
            onClick={() => setActiveTab('market-pulse')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'market-pulse'
                ? 'bg-indigo-600 text-white shadow-[0_0_10px_rgba(79,70,229,0.4)] font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#111318]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Market & Sectors Pulse
          </button>

          <button
            id="nav-tab-comparator"
            onClick={() => setActiveTab('comparator')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'comparator'
                ? 'bg-indigo-600 text-white shadow-[0_0_10px_rgba(79,70,229,0.4)] font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#111318]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Peer Comparison
          </button>

          <button
            id="nav-tab-calculator"
            onClick={() => setActiveTab('calculator')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'calculator'
                ? 'bg-indigo-600 text-white shadow-[0_0_10px_rgba(79,70,229,0.4)] font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#111318]'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            Risk & Position Sizing
          </button>

          <button
            id="nav-tab-watchlist"
            onClick={() => setActiveTab('watchlist')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap relative ${
              activeTab === 'watchlist'
                ? 'bg-indigo-600 text-white shadow-[0_0_10px_rgba(79,70,229,0.4)] font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#111318]'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            Watchlist
            {watchlistCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-green-400 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                {watchlistCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};

