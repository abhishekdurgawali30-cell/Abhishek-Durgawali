import React, { useState } from 'react';
import { StockAnalysisReport, SignalGrade } from '../types';
import { TechnicalVisualizer } from './TechnicalVisualizer';
import { FundamentalVisualizer } from './FundamentalVisualizer';
import { OptionSignalsCard } from './OptionSignalsCard';
import {
  TrendingUp,
  ShieldAlert,
  Target,
  CheckCircle2,
  AlertTriangle,
  Bookmark,
  Share2,
  Copy,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Send,
  Building2,
  Layers,
  Activity,
  Check,
  Zap,
  BarChart2,
} from 'lucide-react';

interface StockAnalysisCardProps {
  report: StockAnalysisReport;
  onSaveToWatchlist?: (report: StockAnalysisReport) => void;
  isSaved?: boolean;
}

export const StockAnalysisCard: React.FC<StockAnalysisCardProps> = ({
  report,
  onSaveToWatchlist,
  isSaved = false,
}) => {
  const [activeSubView, setActiveSubView] = useState<'equity' | 'options'>('equity');
  const [copied, setCopied] = useState(false);
  const [chatQuestion, setChatQuestion] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatResponses, setChatResponses] = useState<Array<{ q: string; a: string }>>([]);

  const outlook = report.actionableOutlook;
  const signal = outlook.signalGrade;

  // Signal Badge Styling for Immersive UI
  const getSignalBadgeStyle = (grade: SignalGrade) => {
    switch (grade) {
      case 'STRONGLY BULLISH / BUY':
        return 'bg-green-500/10 border border-green-500/50 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.15)] text-green-400 font-bold text-xs tracking-wider uppercase';
      case 'ACCUMULATE ON DIPS':
        return 'bg-teal-500/10 border border-teal-500/50 rounded-full shadow-[0_0_20px_rgba(20,184,166,0.15)] text-teal-400 font-bold text-xs tracking-wider uppercase';
      case 'NEUTRAL / HOLD':
        return 'bg-yellow-500/10 border border-yellow-500/50 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.15)] text-yellow-400 font-bold text-xs tracking-wider uppercase';
      case 'BEARISH / REDUCE':
        return 'bg-red-500/10 border border-red-500/50 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.2)] text-red-400 font-bold text-xs tracking-wider uppercase';
      default:
        return 'bg-slate-800 border border-slate-700 text-slate-300 rounded-full';
    }
  };

  const handleCopyReport = () => {
    const textSummary = `
📊 ${report.ticker} (${report.companyName}) - NSE/BSE Market Analysis
💰 CMP: ₹${report.currentMarketPrice} | Sector: ${report.sector}
⚡ Signal: ${outlook.signalGrade}
🎯 Entry: ₹${outlook.idealEntryRangeMin} - ₹${outlook.idealEntryRangeMax}
🎯 Target 1: ₹${outlook.target1} (+${outlook.potentialRewardPercentT1}%)
🎯 Target 2: ₹${outlook.target2} (+${outlook.potentialRewardPercentT2}%)
🛑 Stop Loss: ₹${outlook.strictStopLoss} (-${outlook.stopLossRiskPercent}%)
⏳ Horizon: ${outlook.timeHorizon} | R:R ${outlook.riskRewardRatio}

✅ TOP STRENGTHS:
${report.topStrengths.map((s) => `• ${s}`).join('\n')}

⚠️ KEY RISKS:
${report.topRisks.map((r) => `• ${r}`).join('\n')}

📌 SUMMARY VERDICT:
${report.summaryVerdict}

⚠️ ${report.sebiDisclaimer}
    `.trim();

    navigator.clipboard.writeText(textSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAskAnalyst = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatQuestion.trim() || chatLoading) return;

    const q = chatQuestion.trim();
    setChatQuestion('');
    setChatLoading(true);

    try {
      const res = await fetch('/api/stock-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticker: report.ticker,
          question: q,
          currentAnalysis: report,
        }),
      });

      const data = await res.json();
      setChatResponses((prev) => [
        ...prev,
        { q, a: data.answer || 'No response available.' },
      ]);
    } catch (err) {
      console.error(err);
      setChatResponses((prev) => [
        ...prev,
        { q, a: 'Failed to contact analyst backend. Please retry.' },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="bg-[#111318] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden divide-y divide-slate-800/80 animate-in fade-in duration-300">
      {/* SECTION 1: Stock Overview & Header */}
      <div className="p-5 sm:p-6 bg-gradient-to-b from-[#151821] to-[#111318]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white">
                {report.ticker}
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-[#0d0f14] text-slate-300 border border-slate-700 font-mono">
                {report.exchange}
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-indigo-950/70 text-indigo-300 border border-indigo-800/60 flex items-center gap-1">
                <Building2 className="w-3 h-3" /> {report.sector}
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-semibold text-slate-400 mt-1">
              {report.companyName}
            </h2>
          </div>

          {/* Current Market Price Context & Quick Actions */}
          <div className="flex items-center gap-3">
            <div className="bg-[#08090b] px-4 py-2.5 rounded-xl border border-slate-800 text-right shadow-inner">
              <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                Live CMP
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono text-green-400">
                ₹{report.currentMarketPrice?.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-1.5">
              <button
                id="btn-copy-report"
                onClick={handleCopyReport}
                className="p-2.5 bg-[#0d0f14] hover:bg-slate-800 text-slate-300 rounded-xl transition-colors text-xs font-semibold flex items-center gap-1.5 border border-slate-800"
                title="Copy structured report"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
              </button>

              {onSaveToWatchlist && (
                <button
                  id="btn-save-watchlist"
                  onClick={() => onSaveToWatchlist(report)}
                  className={`p-2.5 rounded-xl transition-colors text-xs font-semibold flex items-center gap-1.5 border ${
                    isSaved
                      ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/50 shadow-[0_0_10px_rgba(79,70,229,0.3)]'
                      : 'bg-[#0d0f14] hover:bg-slate-800 text-slate-300 border-slate-800'
                  }`}
                  title="Bookmark to Watchlist"
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-indigo-400 text-indigo-400' : ''}`} />
                  <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Watchlist'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 2: Signal & Actionable Outlook Banner */}
        <div className="mt-5 p-4 rounded-xl bg-[#08090b] border border-slate-800">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Signal Grade:
              </div>
              <span
                id="badge-signal-grade"
                className={`px-4 py-1.5 flex items-center gap-1.5 ${getSignalBadgeStyle(
                  signal
                )}`}
              >
                <TrendingUp className="w-4 h-4" />
                {signal}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-[#111318] text-slate-300 font-mono font-semibold border border-slate-800">
                Horizon: <strong className="text-white">{outlook.timeHorizon}</strong>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#111318] text-slate-300 font-mono font-semibold border border-slate-800">
                Risk: <strong className="text-amber-400">{report.riskMetrics?.volatility || 'Medium'}</strong>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#111318] text-slate-300 font-mono font-semibold border border-slate-800">
                SL Risk: <strong className="text-red-400">-{outlook.stopLossRiskPercent}%</strong>
              </span>
            </div>
          </div>

          <p className="mt-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            {outlook.signalRationale}
          </p>
        </div>

        {/* View Switcher: Equity Scan vs Option Trading Signals */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-4 flex-wrap gap-2">
          <div className="flex bg-[#08090b] p-1 rounded-xl border border-slate-800 text-xs">
            <button
              id="subtab-equity-structure"
              onClick={() => setActiveSubView('equity')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-bold transition-all ${
                activeSubView === 'equity'
                  ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(79,70,229,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              Equity & Technical Structure
            </button>
            <button
              id="subtab-option-signals"
              onClick={() => setActiveSubView('options')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-bold transition-all relative ${
                activeSubView === 'options'
                  ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(79,70,229,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              Option Trading Signals & F&O Chain
              <span className="ml-1 px-1.5 py-0.2 rounded bg-yellow-400 text-slate-950 text-[9px] font-black uppercase">
                F&O
              </span>
            </button>
          </div>

          <span className="text-[11px] font-mono text-slate-400">
            {activeSubView === 'equity' ? 'Cash Delivery Market' : 'NSE Derivatives & Open Interest'}
          </span>
        </div>
      </div>

      {/* SUB-VIEW 2: Option Trading Signals & F&O */}
      {activeSubView === 'options' && (
        <div className="p-5 sm:p-6 bg-[#0d0f14]/50">
          {report.optionSignal ? (
            <OptionSignalsCard signalData={report.optionSignal} />
          ) : (
            <div className="p-8 text-center bg-[#111318] border border-slate-800 rounded-xl">
              <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-white">Loading Option Trading Signals...</h4>
              <p className="text-xs text-slate-400 mt-1">Generating strikes, PCR, and defined-risk strategy setup.</p>
            </div>
          )}
        </div>
      )}

      {/* SUB-VIEW 1: Technical & Fundamental Drivers */}
      {activeSubView === 'equity' && (
      <div className="p-5 sm:p-6 space-y-6">
        {/* Technical Structure Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" />
              Technical Structure & Roadmap
            </h3>
            <span className="text-xs text-slate-400 font-mono">{report.technicalStructure.priceVsEmaSummary}</span>
          </div>
          <TechnicalVisualizer
            technical={report.technicalStructure}
            outlook={report.actionableOutlook}
            cmp={report.currentMarketPrice}
          />
        </div>

        {/* Fundamental Health Section */}
        <div className="pt-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              Fundamental Health & Balance Sheet Ratios
            </h3>
            <span className="text-xs text-slate-400">
              Sector: {report.sector} ({report.marketContext.sectorTrend} Trend)
            </span>
          </div>
          <FundamentalVisualizer fundamental={report.fundamentalHealth} />
        </div>

        {/* SECTION 3: Key Fundamental Drivers (Top 3 Strengths & Top 2 Risks) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Top 3 Strengths */}
          <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4">
            <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              Top 3 Fundamental & Technical Strengths
            </h4>
            <ul className="space-y-2 text-xs text-slate-200">
              {report.topStrengths?.map((strength, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-green-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Top 2 Risks */}
          <div className="bg-red-950/20 border border-red-500/30 rounded-xl p-4">
            <h4 className="text-xs font-bold text-red-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              Top 2 Key Risks & Vulnerabilities
            </h4>
            <ul className="space-y-2 text-xs text-slate-200">
              {report.topRisks?.map((risk, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="w-4 h-4 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Market Context, News & Catalysts */}
        <div className="bg-[#08090b] border border-slate-800 rounded-xl p-4 text-xs">
          <h4 className="font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
            Market Context & Recent Corporate Catalysts
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300">
            <div>
              <span className="text-slate-500 font-medium block mb-1">Macro / Nifty Index Bias:</span>
              <p className="leading-relaxed">{report.marketContext?.niftyBiasImpact || 'Aligned with broader market trend.'}</p>
            </div>
            <div>
              <span className="text-slate-500 font-medium block mb-1">Key News / Events:</span>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                {report.marketContext?.recentNewsOrCatalysts?.map((news, i) => (
                  <li key={i}>{news}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Summary Verdict */}
        <div className="bg-gradient-to-r from-[#08090b] via-[#0d0f14] to-[#111318] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Senior Analyst Final Verdict
          </div>
          <p className="text-sm text-slate-200 font-medium leading-relaxed">
            {report.summaryVerdict}
          </p>
        </div>

        {/* Grounding Sources */}
        {report.groundingSources && report.groundingSources.length > 0 && (
          <div className="pt-2 text-[11px] text-slate-400">
            <span className="font-semibold text-slate-400 mr-2">Verified Real-Time Sources:</span>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {report.groundingSources.map((source, i) => (
                <a
                  key={i}
                  href={source.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#08090b] hover:bg-slate-800 text-slate-400 hover:text-indigo-300 transition-colors border border-slate-800"
                >
                  <span className="truncate max-w-[200px]">{source.title}</span>
                  <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Interactive Follow-up Analyst Chat */}
        <div className="pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
            <MessageSquare className="w-4 h-4 text-indigo-400" />
            Ask Senior Analyst a Custom Inquiry for {report.ticker}
          </div>

          {chatResponses.length > 0 && (
            <div className="space-y-3 mb-3 max-h-60 overflow-y-auto pr-1">
              {chatResponses.map((item, i) => (
                <div key={i} className="space-y-1 text-xs">
                  <div className="bg-[#0d0f14] p-2.5 rounded-lg text-slate-200 font-semibold border border-slate-800">
                    Q: {item.q}
                  </div>
                  <div className="bg-[#08090b] p-2.5 rounded-lg text-slate-300 leading-relaxed border border-slate-800 whitespace-pre-line font-mono text-[11px]">
                    {item.a}
                  </div>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleAskAnalyst} className="flex gap-2">
            <input
              type="text"
              value={chatQuestion}
              onChange={(e) => setChatQuestion(e.target.value)}
              placeholder={`e.g. What happens to ${report.ticker} if Nifty corrects to 24,000? Is it suitable for SIP?`}
              className="flex-1 px-3.5 py-2.5 bg-[#08090b] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
              disabled={chatLoading}
            />
            <button
              type="submit"
              disabled={chatLoading || !chatQuestion.trim()}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shrink-0 shadow-[0_0_10px_rgba(79,70,229,0.3)]"
            >
              {chatLoading ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Ask</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
      )}
    </div>
  );
};

