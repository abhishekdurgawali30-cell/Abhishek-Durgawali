import React, { useState, useEffect } from 'react';
import { OptionSignalReport } from '../types';
import { OptionSignalsCard } from './OptionSignalsCard';
import {
  Zap,
  Search,
  Activity,
  TrendingUp,
  Sliders,
  ShieldAlert,
  Layers,
  ArrowRight,
  Flame,
} from 'lucide-react';

const POPULAR_FNO_ASSETS = [
  { symbol: 'NIFTY', name: 'Nifty 50 Index', category: 'Index', defaultSpot: 24780.0 },
  { symbol: 'BANKNIFTY', name: 'Nifty Bank Index', category: 'Index', defaultSpot: 51650.0 },
  { symbol: 'FINNIFTY', name: 'Nifty Financial Services', category: 'Index', defaultSpot: 23850.0 },
  { symbol: 'MIDCPNIFTY', name: 'Nifty Midcap Select', category: 'Index', defaultSpot: 13200.0 },
  { symbol: 'RELIANCE', name: 'Reliance Industries', category: 'Stock', defaultSpot: 2985.0 },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Limited', category: 'Stock', defaultSpot: 1640.0 },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Limited', category: 'Stock', defaultSpot: 1210.0 },
  { symbol: 'TCS', name: 'Tata Consultancy Services', category: 'Stock', defaultSpot: 4180.0 },
  { symbol: 'INFY', name: 'Infosys Limited', category: 'Stock', defaultSpot: 1860.0 },
  { symbol: 'TATAMOTORS', name: 'Tata Motors Limited', category: 'Stock', defaultSpot: 1040.0 },
  { symbol: 'SBIN', name: 'State Bank of India', category: 'Stock', defaultSpot: 825.0 },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Limited', category: 'Stock', defaultSpot: 1540.0 },
  { symbol: 'LT', name: 'Larsen & Toubro', category: 'Stock', defaultSpot: 3620.0 },
  { symbol: 'TRENT', name: 'Trent Limited (Retail)', category: 'Stock', defaultSpot: 7120.0 },
  { symbol: 'ZOMATO', name: 'Zomato Limited', category: 'Stock', defaultSpot: 265.0 },
];

export const OptionsTerminalView: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>('NIFTY');
  const [customTicker, setCustomTicker] = useState<string>('');
  const [expiryType, setExpiryType] = useState<'Weekly' | 'Monthly'>('Weekly');
  const [simulatedSpot, setSimulatedSpot] = useState<string>('');
  const [optionData, setOptionData] = useState<OptionSignalReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOptionSignals = async (ticker: string, expType: 'Weekly' | 'Monthly', spot?: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/option-signals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticker: ticker.toUpperCase(),
          expiryType: expType,
          spotPrice: spot,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate option signal');
      }

      setOptionData(data);
    } catch (err: any) {
      console.error('Error fetching option signals:', err);
      setError(err.message || 'Unable to scan option chain data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOptionSignals(selectedSymbol, expiryType);
  }, [selectedSymbol, expiryType]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTicker.trim()) return;
    const clean = customTicker.trim().toUpperCase();
    setSelectedSymbol(clean);
    setSimulatedSpot('');
  };

  const handleApplySimulatedSpot = () => {
    const spotVal = parseFloat(simulatedSpot);
    if (!isNaN(spotVal) && spotVal > 0) {
      fetchOptionSignals(selectedSymbol, expiryType, spotVal);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner Header */}
      <div className="bg-[#111318] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md">
                <Zap className="w-4 h-4" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                Option Trading Signals & F&O Matrix
              </h2>
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-indigo-950/80 text-indigo-300 border border-indigo-800 font-mono">
                NSE DERIVATIVES
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Algorithmic Open Interest (OI) buildup scanner, Put-Call Ratio (PCR) analytics, Max Pain calculation, Option Greeks (Delta, Theta, Gamma, Vega), and mathematical Defined-Risk Option Spread setups.
            </p>
          </div>

          {/* Quick Search Input */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-56">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="fno-ticker-search-input"
                type="text"
                value={customTicker}
                onChange={(e) => setCustomTicker(e.target.value)}
                placeholder="Search F&O Ticker (e.g. ITC, MARUTI)..."
                className="w-full bg-[#08090b] border border-slate-700 focus:border-indigo-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none font-mono uppercase transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all shrink-0"
            >
              Scan F&O
            </button>
          </form>
        </div>

        {/* Quick F&O Instrument Pills */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Quick Select Benchmark Indices & F&O Heavyweights:
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {POPULAR_FNO_ASSETS.map((asset) => {
              const isSelected = selectedSymbol === asset.symbol;
              const isIndex = asset.category === 'Index';
              return (
                <button
                  key={asset.symbol}
                  id={`fno-pill-${asset.symbol}`}
                  onClick={() => {
                    setSelectedSymbol(asset.symbol);
                    setCustomTicker('');
                    setSimulatedSpot('');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(79,70,229,0.4)]'
                      : isIndex
                      ? 'bg-[#151821] text-indigo-300 hover:bg-slate-800 border border-indigo-900/40'
                      : 'bg-[#0d0f14] text-slate-400 hover:text-slate-200 hover:bg-[#151821] border border-slate-800'
                  }`}
                >
                  <span>{asset.symbol}</span>
                  {isIndex && (
                    <span className="text-[9px] px-1 py-0.2 rounded bg-indigo-950 text-indigo-300">
                      INDEX
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="bg-[#111318] border border-slate-800 rounded-2xl p-12 text-center shadow-2xl">
          <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-base font-bold text-white">Scanning NSE Option Chain & Greeks for {selectedSymbol}...</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
            Parsing Call & Put Open Interest accumulation, calculating PCR ratio, computing Max Pain equilibrium, and synthesizing defined-risk spread signals.
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && !isLoading && (
        <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 text-red-300 text-xs flex items-center gap-2 shadow-inner">
          <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Option Signals Card Display */}
      {!isLoading && optionData && (
        <OptionSignalsCard
          signalData={optionData}
          onRefreshExpiry={(newExp) => {
            setExpiryType(newExp);
          }}
        />
      )}
    </div>
  );
};
