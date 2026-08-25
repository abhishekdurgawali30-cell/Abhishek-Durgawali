import React, { useState } from 'react';
import { Search, Sparkles, SlidersHorizontal, ArrowRight, TrendingUp } from 'lucide-react';
import { POPULAR_NSE_STOCKS } from '../data/popularStocks';
import { TimeHorizon } from '../types';

interface StockSearchFormProps {
  onAnalyze: (params: {
    ticker: string;
    exchange: 'NSE' | 'BSE';
    cmp?: number;
    timeHorizon: TimeHorizon;
    customContext?: string;
  }) => void;
  isLoading: boolean;
}

export const StockSearchForm: React.FC<StockSearchFormProps> = ({ onAnalyze, isLoading }) => {
  const [ticker, setTicker] = useState<string>('RELIANCE');
  const [exchange, setExchange] = useState<'NSE' | 'BSE'>('NSE');
  const [cmp, setCmp] = useState<string>('');
  const [timeHorizon, setTimeHorizon] = useState<TimeHorizon>('Swing (1-4 weeks)');
  const [customContext, setCustomContext] = useState<string>('');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker.trim()) return;

    onAnalyze({
      ticker: ticker.trim().toUpperCase(),
      exchange,
      cmp: cmp ? parseFloat(cmp) : undefined,
      timeHorizon,
      customContext: customContext.trim() || undefined,
    });
  };

  const handleQuickSelect = (symbol: string, approxPrice?: number) => {
    setTicker(symbol);
    if (approxPrice) {
      setCmp(approxPrice.toString());
    }
  };

  const filteredQuickStocks = selectedCategory === 'All' 
    ? POPULAR_NSE_STOCKS 
    : POPULAR_NSE_STOCKS.filter((s) => s.category === selectedCategory);

  return (
    <div className="bg-[#111318] border border-slate-800 rounded-2xl p-5 shadow-inner">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Main Search Input Bar */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Search className="w-5 h-5" />
            </div>
            <input
              id="input-stock-ticker"
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              placeholder="Enter NSE/BSE Ticker (e.g. HDFCBANK, RELIANCE, TCS, TATAMOTORS, TRENT)..."
              className="w-full pl-11 pr-24 py-3.5 bg-[#08090b] border border-slate-700/80 rounded-xl text-white placeholder-slate-500 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm tracking-wide uppercase font-mono"
              disabled={isLoading}
              required
            />
            <div className="absolute inset-y-0 right-1.5 flex items-center gap-1 pr-1.5">
              <button
                type="button"
                id="btn-toggle-nse"
                onClick={() => setExchange('NSE')}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                  exchange === 'NSE'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white bg-slate-850'
                }`}
              >
                NSE
              </button>
              <button
                type="button"
                id="btn-toggle-bse"
                onClick={() => setExchange('BSE')}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                  exchange === 'BSE'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white bg-slate-850'
                }`}
              >
                BSE
              </button>
            </div>
          </div>

          <div className="w-full md:w-56">
            <select
              id="select-time-horizon"
              value={timeHorizon}
              onChange={(e) => setTimeHorizon(e.target.value as TimeHorizon)}
              className="w-full py-3.5 px-3 bg-[#08090b] border border-slate-700/80 rounded-xl text-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isLoading}
            >
              <option value="Intraday">Intraday (Day Setup)</option>
              <option value="Swing (1-4 weeks)">Swing (1-4 weeks)</option>
              <option value="Positional (1-3 months)">Positional (1-3 months)</option>
              <option value="Long-Term (1-3 years)">Long-Term (1-3 years)</option>
            </select>
          </div>

          <button
            type="submit"
            id="btn-execute-analysis"
            disabled={isLoading || !ticker.trim()}
            className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all shadow-[0_0_15px_rgba(79,70,229,0.35)] flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Scanning NSE & Order Book...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-indigo-200" />
                <span>Run Market Analysis</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Quick Filters / Pill Selectors for Active Indian Tickers */}
        <div className="pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
              <span>Quick Indian Equities:</span>
            </div>
            <div className="flex items-center gap-1 text-[11px]">
              {['All', 'Nifty 50 Largecap', 'High Growth Midcap', 'Momentum / Trending'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-0.5 rounded-md transition-colors ${
                    selectedCategory === cat
                      ? 'bg-indigo-950/60 border border-indigo-800 text-indigo-300 font-semibold'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {cat === 'All' ? 'All' : cat.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto pr-1">
            {filteredQuickStocks.map((stock) => (
              <button
                key={stock.symbol}
                type="button"
                id={`btn-quick-${stock.symbol}`}
                onClick={() => handleQuickSelect(stock.symbol, stock.approxPrice)}
                className={`px-2.5 py-1 text-xs rounded-lg font-mono transition-all border ${
                  ticker.toUpperCase() === stock.symbol
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold shadow-[0_0_8px_rgba(79,70,229,0.3)]'
                    : 'bg-[#0d0f14] border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                }`}
              >
                {stock.symbol}
                <span className="text-[10px] text-slate-400 ml-1 font-sans">₹{stock.approxPrice}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Advanced Options Toggle */}
        <div className="pt-1 flex items-center justify-between text-xs">
          <button
            type="button"
            id="btn-toggle-advanced"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-slate-400 hover:text-indigo-400 flex items-center gap-1.5 font-medium transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            {showAdvanced ? 'Hide Advanced Context' : 'Add Custom CMP / Specific Chart Query'}
          </button>
        </div>

        {/* Advanced Context Fields */}
        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 bg-[#08090b] rounded-xl border border-slate-800 animate-in fade-in duration-200">
            <div>
              <label htmlFor="input-cmp" className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                Custom CMP (₹) <span className="text-slate-500 font-normal">(Optional override)</span>
              </label>
              <input
                id="input-cmp"
                type="number"
                step="0.05"
                value={cmp}
                onChange={(e) => setCmp(e.target.value)}
                placeholder="e.g. 2980.50"
                className="w-full px-3 py-2 bg-[#0d0f14] border border-slate-700 rounded-lg text-white text-xs font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="input-custom-context" className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                Specific Technical / Fundamental Query <span className="text-slate-500 font-normal">(Optional)</span>
              </label>
              <input
                id="input-custom-context"
                type="text"
                value={customContext}
                onChange={(e) => setCustomContext(e.target.value)}
                placeholder="e.g. Test if stock is making a double bottom near 200-EMA or evaluate Q3 PAT growth"
                className="w-full px-3 py-2 bg-[#0d0f14] border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
