import React, { useState } from 'react';
import { Layers, ArrowRightLeft, Sparkles, Award, TrendingUp, AlertTriangle } from 'lucide-react';
import { POPULAR_NSE_STOCKS } from '../data/popularStocks';

export const StockComparatorView: React.FC = () => {
  const [ticker1, setTicker1] = useState<string>('TCS');
  const [ticker2, setTicker2] = useState<string>('INFY');
  const [loading, setLoading] = useState<boolean>(false);
  const [comparisonResult, setComparisonResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCompare = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!ticker1.trim() || !ticker2.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/compare-stocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticker1: ticker1.trim().toUpperCase(),
          ticker2: ticker2.trim().toUpperCase(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setComparisonResult(data);
      } else {
        setError(data.error || 'Failed to compare stocks.');
      }
    } catch (err: any) {
      console.error(err);
      setError('Network error while comparing tickers.');
    } finally {
      setLoading(false);
    }
  };

  const presetPairs = [
    { t1: 'TCS', t2: 'INFY', label: 'IT Giants: TCS vs Infosys' },
    { t1: 'HDFCBANK', t2: 'ICICIBANK', label: 'Private Banks: HDFC vs ICICI' },
    { t1: 'TATAMOTORS', t2: 'MARUTI', label: 'Auto Leaders: Tata Motors vs Maruti' },
    { t1: 'TRENT', t2: 'ZOMATO', label: 'High Growth: Trent vs Zomato' },
  ];

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-[#111318] border border-slate-800 rounded-2xl p-5 shadow-xl">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
          <Layers className="w-5 h-5 text-indigo-400" />
          Indian Equities Head-to-Head Peer Comparator
        </h2>
        <p className="text-xs text-slate-400 mb-4">
          Direct quantitative benchmarking across valuation (P/E), ROCE, ROE, promoter holdings, and technical momentum
        </p>

        <form onSubmit={handleCompare} className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1">Stock A (NSE/BSE)</label>
            <input
              type="text"
              value={ticker1}
              onChange={(e) => setTicker1(e.target.value.toUpperCase())}
              placeholder="e.g. TCS"
              className="w-full px-3.5 py-2.5 bg-[#08090b] border border-slate-800 rounded-xl text-white font-mono uppercase text-sm font-bold focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="flex items-end justify-center pb-2">
            <div className="w-8 h-8 rounded-full bg-[#08090b] text-indigo-400 flex items-center justify-center font-bold text-xs border border-slate-800">
              VS
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1">Stock B (NSE/BSE)</label>
            <input
              type="text"
              value={ticker2}
              onChange={(e) => setTicker2(e.target.value.toUpperCase())}
              placeholder="e.g. INFY"
              className="w-full px-3.5 py-2.5 bg-[#08090b] border border-slate-800 rounded-xl text-white font-mono uppercase text-sm font-bold focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="sm:col-span-5 flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-slate-400 font-medium">Popular Battles:</span>
              {presetPairs.map((pair, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setTicker1(pair.t1);
                    setTicker2(pair.t2);
                  }}
                  className="px-2.5 py-1 text-xs rounded-lg bg-[#08090b] hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors font-mono"
                >
                  {pair.t1} vs {pair.t2}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading || !ticker1.trim() || !ticker2.trim()}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(79,70,229,0.35)] ml-auto"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Comparing Fundamentals...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Run Comparison</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="bg-red-950/20 border border-red-500/30 p-4 rounded-xl text-xs text-red-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          {error}
        </div>
      )}

      {comparisonResult && (
        <div className="space-y-4">
          {/* Winners Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#08090b] border border-green-500/30 rounded-2xl p-4 shadow-xl">
              <div className="flex items-center gap-2 text-xs font-bold text-green-400 uppercase tracking-wider mb-1">
                <Award className="w-4 h-4" /> Swing Trading Verdict
              </div>
              <div className="text-xl font-bold font-mono text-white">
                Winner: {comparisonResult.headToHeadWinner?.swingTradeWinner}
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {comparisonResult.headToHeadWinner?.swingRationale}
              </p>
            </div>

            <div className="bg-[#08090b] border border-indigo-500/30 rounded-2xl p-4 shadow-xl">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
                <Award className="w-4 h-4" /> 3-Year Long Term Investment Verdict
              </div>
              <div className="text-xl font-bold font-mono text-white">
                Winner: {comparisonResult.headToHeadWinner?.longTermWinner}
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {comparisonResult.headToHeadWinner?.longTermRationale}
              </p>
            </div>
          </div>

          {/* Side by side comparison cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Stock 1 */}
            <div className="bg-[#111318] border border-slate-800 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-xl font-black font-mono text-white">{comparisonResult.ticker1?.symbol}</h3>
                  <p className="text-xs text-slate-400">{comparisonResult.ticker1?.name}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold font-mono text-green-400">
                    ₹{comparisonResult.ticker1?.cmp?.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-green-950/80 text-green-300 border border-green-800/50">
                    {comparisonResult.ticker1?.signal}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs border-t border-slate-800 pt-3">
                <div className="flex justify-between py-1 border-b border-slate-850">
                  <span className="text-slate-400">P/E Ratio:</span>
                  <span className="font-mono text-white font-bold">{comparisonResult.ticker1?.pe}x</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-850">
                  <span className="text-slate-400">ROCE:</span>
                  <span className="font-mono text-green-400 font-bold">{comparisonResult.ticker1?.roce}%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-850">
                  <span className="text-slate-400">ROE:</span>
                  <span className="font-mono text-white font-bold">{comparisonResult.ticker1?.roe}%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-850">
                  <span className="text-slate-400">Promoter Holding:</span>
                  <span className="font-mono text-white font-bold">{comparisonResult.ticker1?.promoterHolding}%</span>
                </div>
                <div className="pt-1 text-slate-300">
                  <span className="text-slate-500 font-semibold block text-[11px]">Key Moat:</span>
                  {comparisonResult.ticker1?.keyAdvantage}
                </div>
              </div>
            </div>

            {/* Stock 2 */}
            <div className="bg-[#111318] border border-slate-800 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-xl font-black font-mono text-white">{comparisonResult.ticker2?.symbol}</h3>
                  <p className="text-xs text-slate-400">{comparisonResult.ticker2?.name}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold font-mono text-green-400">
                    ₹{comparisonResult.ticker2?.cmp?.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-green-950/80 text-green-300 border border-green-800/50">
                    {comparisonResult.ticker2?.signal}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs border-t border-slate-800 pt-3">
                <div className="flex justify-between py-1 border-b border-slate-850">
                  <span className="text-slate-400">P/E Ratio:</span>
                  <span className="font-mono text-white font-bold">{comparisonResult.ticker2?.pe}x</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-850">
                  <span className="text-slate-400">ROCE:</span>
                  <span className="font-mono text-green-400 font-bold">{comparisonResult.ticker2?.roce}%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-850">
                  <span className="text-slate-400">ROE:</span>
                  <span className="font-mono text-white font-bold">{comparisonResult.ticker2?.roe}%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-850">
                  <span className="text-slate-400">Promoter Holding:</span>
                  <span className="font-mono text-white font-bold">{comparisonResult.ticker2?.promoterHolding}%</span>
                </div>
                <div className="pt-1 text-slate-300">
                  <span className="text-slate-500 font-semibold block text-[11px]">Key Moat:</span>
                  {comparisonResult.ticker2?.keyAdvantage}
                </div>
              </div>
            </div>
          </div>

          {/* Comparative Metrics Table */}
          <div className="bg-[#111318] border border-slate-800 rounded-2xl p-5 shadow-xl overflow-x-auto">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              Direct Metric-by-Metric Scorecard
            </h4>
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                  <th className="pb-2">Metric</th>
                  <th className="pb-2 font-mono">{comparisonResult.ticker1?.symbol}</th>
                  <th className="pb-2 font-mono">{comparisonResult.ticker2?.symbol}</th>
                  <th className="pb-2">Analyst Edge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {comparisonResult.comparativeTable?.map((row: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-800/30">
                    <td className="py-2.5 text-slate-300 font-medium">{row.metric}</td>
                    <td className="py-2.5 font-mono text-white">{row.stock1Value}</td>
                    <td className="py-2.5 font-mono text-white">{row.stock2Value}</td>
                    <td className="py-2.5 text-green-400 font-semibold">{row.winner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Analyst Summary Takeaway */}
          <div className="bg-[#08090b] border border-slate-800 rounded-xl p-4 text-xs text-slate-300">
            <span className="font-bold text-white uppercase tracking-wider block mb-1">
              Analyst Benchmarking Summary:
            </span>
            <p className="leading-relaxed">{comparisonResult.analystTakeaway}</p>
          </div>
        </div>
      )}
    </div>
  );
};
