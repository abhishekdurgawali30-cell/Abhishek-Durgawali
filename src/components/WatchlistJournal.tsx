import React, { useState } from 'react';
import { StockAnalysisReport } from '../types';
import { Bookmark, Trash2, ArrowUpRight, TrendingUp, Target, ShieldAlert, Sparkles, ExternalLink } from 'lucide-react';

interface WatchlistJournalProps {
  savedReports: StockAnalysisReport[];
  onRemove: (id: string) => void;
  onSelect: (report: StockAnalysisReport) => void;
  onReAnalyze: (ticker: string) => void;
}

export const WatchlistJournal: React.FC<WatchlistJournalProps> = ({
  savedReports,
  onRemove,
  onSelect,
  onReAnalyze,
}) => {
  const [filter, setFilter] = useState<string>('All');

  const filtered = filter === 'All'
    ? savedReports
    : savedReports.filter((r) => r.actionableOutlook.signalGrade === filter);

  if (savedReports.length === 0) {
    return (
      <div className="bg-[#111318] border border-slate-800 rounded-2xl p-12 text-center shadow-xl">
        <div className="w-12 h-12 rounded-2xl bg-[#08090b] border border-slate-800 text-indigo-400 flex items-center justify-center mx-auto mb-3">
          <Bookmark className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-white mb-1">Your Stock Watchlist is Empty</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Scan any Indian equity ticker (e.g. RELIANCE, TCS, TATAMOTORS, SUZLON) and click "Watchlist" to bookmark actionable setups and targets.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-[#111318] border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-indigo-400" />
            Active Tracked Watchlist & Trade Journal ({savedReports.length})
          </h2>
          <p className="text-xs text-slate-400">
            Monitor target progress and revisit calculated stop losses
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-1.5 flex-wrap">
          {['All', 'STRONGLY BULLISH / BUY', 'ACCUMULATE ON DIPS', 'NEUTRAL / HOLD', 'BEARISH / REDUCE'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                filter === cat
                  ? 'bg-indigo-600 text-white shadow-[0_0_10px_rgba(79,70,229,0.35)]'
                  : 'bg-[#08090b] border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat === 'All' ? 'All' : cat.split('/')[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((report) => {
          const outlook = report.actionableOutlook;
          const isBullish = outlook.signalGrade.includes('BULLISH') || outlook.signalGrade.includes('ACCUMULATE');

          return (
            <div
              key={report.id}
              className="bg-[#111318] border border-slate-800 rounded-2xl p-4 shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-black text-lg text-white">{report.ticker}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#08090b] border border-slate-800 text-slate-300 font-bold">
                        {report.exchange}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate max-w-[180px]">{report.companyName}</p>
                  </div>

                  <button
                    onClick={() => onRemove(report.id)}
                    className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
                    title="Remove from watchlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Signal Badge */}
                <div className="my-2.5">
                  <span
                    className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${
                      isBullish
                        ? 'bg-green-500/20 text-green-300 border-green-500/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}
                  >
                    {outlook.signalGrade}
                  </span>
                </div>

                {/* Levels Grid */}
                <div className="grid grid-cols-3 gap-1.5 py-2.5 border-y border-slate-800 text-xs font-mono bg-[#08090b]/50 rounded-lg px-2 my-2">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">CMP</span>
                    <span className="font-bold text-white">₹{report.currentMarketPrice}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-red-400 block uppercase">Stop Loss</span>
                    <span className="font-bold text-red-300">₹{outlook.strictStopLoss}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-green-400 block uppercase">Target 1</span>
                    <span className="font-bold text-green-300">₹{outlook.target1}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                  {outlook.signalRationale}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelect(report)}
                  className="flex-1 py-1.5 px-3 bg-[#08090b] hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1 border border-slate-800"
                >
                  <span>View Details</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onReAnalyze(report.ticker)}
                  className="py-1.5 px-3 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
                  title="Re-run real time AI analysis"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Re-Scan</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
