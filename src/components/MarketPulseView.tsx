import React, { useState, useEffect } from 'react';
import { MarketIndicesPulse } from '../types';
import { Activity, RefreshCw, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Compass, ShieldAlert, Sparkles } from 'lucide-react';

export const MarketPulseView: React.FC = () => {
  const [pulseData, setPulseData] = useState<MarketIndicesPulse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMarketPulse = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/market-pulse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      setPulseData(data);
    } catch (err: any) {
      console.error(err);
      setError('Unable to fetch live market pulse.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketPulse();
  }, []);

  const getBiasBadge = (bias: 'Bullish' | 'Neutral' | 'Bearish') => {
    if (bias === 'Bullish') {
      return 'bg-green-500/20 text-green-300 border-green-500/40';
    }
    if (bias === 'Bearish') {
      return 'bg-red-500/20 text-red-300 border-red-500/40';
    }
    return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
  };

  return (
    <div className="space-y-6">
      {/* Header & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#111318] border border-slate-800 p-4 rounded-2xl shadow-xl">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-400" />
            NSE & BSE Market Pulse & Sector Heatmap
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time benchmark index levels, India VIX volatility gauge, and sectoral leadership trends
          </p>
        </div>

        <button
          id="btn-refresh-pulse"
          onClick={fetchMarketPulse}
          disabled={loading}
          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-2 self-start sm:self-auto transition-all shadow-[0_0_12px_rgba(79,70,229,0.35)]"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-white' : ''}`} />
          <span>Refresh Pulse</span>
        </button>
      </div>

      {loading && !pulseData && (
        <div className="bg-[#111318] border border-slate-800 rounded-2xl p-12 text-center shadow-xl">
          <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm font-semibold text-slate-200">Scanning Indian Benchmark Indices & Sector Data...</p>
          <p className="text-xs text-slate-500 mt-1 font-mono">Grounding with live NSE market breadth</p>
        </div>
      )}

      {pulseData && (
        <>
          {/* Index Pulse Cards (Nifty 50, Bank Nifty, India VIX) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Nifty 50 Card */}
            <div className="bg-[#111318] border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  NIFTY 50 (NSE Benchmark)
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${getBiasBadge(pulseData.nifty50.bias)}`}>
                  {pulseData.nifty50.bias}
                </span>
              </div>

              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl sm:text-3xl font-black font-mono text-white">
                  {pulseData.nifty50.level?.toLocaleString('en-IN')}
                </span>
                <span
                  className={`text-xs font-bold font-mono flex items-center ${
                    pulseData.nifty50.change >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {pulseData.nifty50.change >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  {pulseData.nifty50.change >= 0 ? '+' : ''}{pulseData.nifty50.change} ({pulseData.nifty50.percentChange}%)
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between text-xs font-mono text-slate-400">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Support</span>
                  <span className="text-green-400 font-bold">₹{pulseData.nifty50.support}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block text-[10px] uppercase">Resistance</span>
                  <span className="text-red-400 font-bold">₹{pulseData.nifty50.resistance}</span>
                </div>
              </div>
            </div>

            {/* Bank Nifty Card */}
            <div className="bg-[#111318] border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  BANK NIFTY
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${getBiasBadge(pulseData.bankNifty.bias)}`}>
                  {pulseData.bankNifty.bias}
                </span>
              </div>

              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl sm:text-3xl font-black font-mono text-white">
                  {pulseData.bankNifty.level?.toLocaleString('en-IN')}
                </span>
                <span
                  className={`text-xs font-bold font-mono flex items-center ${
                    pulseData.bankNifty.change >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {pulseData.bankNifty.change >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  {pulseData.bankNifty.change >= 0 ? '+' : ''}{pulseData.bankNifty.change} ({pulseData.bankNifty.percentChange}%)
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between text-xs font-mono text-slate-400">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Support</span>
                  <span className="text-green-400 font-bold">₹{pulseData.bankNifty.support}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block text-[10px] uppercase">Resistance</span>
                  <span className="text-red-400 font-bold">₹{pulseData.bankNifty.resistance}</span>
                </div>
              </div>
            </div>

            {/* India VIX & Sentiment Card */}
            <div className="bg-[#111318] border border-slate-800 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> INDIA VIX
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                  {pulseData.indiaVix.status}
                </span>
              </div>

              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl sm:text-3xl font-black font-mono text-amber-300">
                  {pulseData.indiaVix.level}
                </span>
                <span className="text-xs text-slate-500">Market Fear Index</span>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-300 line-clamp-2 leading-relaxed">
                {pulseData.overallMarketSentiment}
              </div>
            </div>
          </div>

          {/* Sector Heatmap Grid */}
          <div className="bg-[#111318] border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Compass className="w-4 h-4 text-indigo-400" />
              Indian Sectoral Momentum & Rotation Heatmap
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {pulseData.sectorHeatmap?.map((sector, idx) => {
                const isBull = sector.trend === 'Bullish';
                const isBear = sector.trend === 'Bearish';

                return (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isBull
                        ? 'bg-[#08090b] border-green-500/30 hover:border-green-500/60 shadow-inner'
                        : isBear
                        ? 'bg-[#08090b] border-red-500/30 hover:border-red-500/60 shadow-inner'
                        : 'bg-[#08090b] border-slate-800 hover:border-slate-700 shadow-inner'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-xs text-white">{sector.name}</span>
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                          isBull
                            ? 'bg-green-950/80 text-green-300 border border-green-800/50'
                            : isBear
                            ? 'bg-red-950/80 text-red-300 border border-red-800/50'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {sector.percentChange > 0 ? '+' : ''}{sector.percentChange}%
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {sector.topGainersOrNote}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
