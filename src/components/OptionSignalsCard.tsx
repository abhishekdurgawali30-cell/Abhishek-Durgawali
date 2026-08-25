import React, { useState } from 'react';
import { OptionSignalReport, OptionLeg, OptionChainRow } from '../types';
import {
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  Zap,
  Target,
  Layers,
  ArrowRight,
  Activity,
  Calculator,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Copy,
  Check,
  Percent,
  Clock,
} from 'lucide-react';

interface OptionSignalsCardProps {
  signalData: OptionSignalReport;
  onRefreshExpiry?: (expiryType: 'Weekly' | 'Monthly') => void;
}

export const OptionSignalsCard: React.FC<OptionSignalsCardProps> = ({
  signalData,
  onRefreshExpiry,
}) => {
  const [numLots, setNumLots] = useState<number>(1);
  const [chainFilter, setChainFilter] = useState<'ALL' | 'ATM_NEAR' | 'CE_ONLY' | 'PE_ONLY'>('ATM_NEAR');
  const [copiedTrade, setCopiedTrade] = useState(false);

  const strat = signalData.primarySignalSetup;
  const lotSize = signalData.lotSize;
  const totalQuantity = numLots * lotSize;

  // Numerical calculations for interactive trade ticket
  const netDebitCreditPerShare = strat.netPremium;
  const totalNetPremium = Math.abs(netDebitCreditPerShare * totalQuantity);
  const approxMarginRequired = Math.round(strat.marginApproxPerLot * numLots);

  const getBiasBadge = (bias: string) => {
    if (bias.includes('BULLISH')) {
      return 'bg-emerald-500/10 border border-emerald-500/40 text-emerald-400';
    }
    if (bias.includes('BEARISH')) {
      return 'bg-rose-500/10 border border-rose-500/40 text-rose-400';
    }
    return 'bg-amber-500/10 border border-amber-500/40 text-amber-400';
  };

  const getBuildupStyle = (buildup: string) => {
    switch (buildup) {
      case 'Long Buildup':
        return 'text-emerald-400 bg-emerald-950/40 border border-emerald-800/50';
      case 'Short Covering':
        return 'text-teal-300 bg-teal-950/40 border border-teal-800/50';
      case 'Short Buildup':
        return 'text-rose-400 bg-rose-950/40 border border-rose-800/50';
      case 'Long Unwinding':
        return 'text-amber-400 bg-amber-950/40 border border-amber-800/50';
      default:
        return 'text-slate-400 bg-slate-850';
    }
  };

  const filteredChain = signalData.optionChainSummary.filter((row) => {
    if (chainFilter === 'ATM_NEAR') {
      const atmIndex = signalData.optionChainSummary.findIndex((r) => r.isAtm);
      if (atmIndex === -1) return true;
      const rowIndex = signalData.optionChainSummary.indexOf(row);
      return Math.abs(rowIndex - atmIndex) <= 3;
    }
    return true;
  });

  const handleCopyTradeTicket = () => {
    const legsText = strat.legs
      .map(
        (leg) =>
          `• ${leg.action} ${numLots} Lot (${numLots * lotSize} Qty) ${signalData.ticker} ${leg.strike} ${leg.optionType} @ Approx ₹${leg.approxPremium}`
      )
      .join('\n');

    const text = `
🎯 F&O OPTION STRATEGY TICKET: ${strat.strategyName}
📊 Instrument: ${signalData.ticker} (Spot: ₹${signalData.spotPrice})
⏳ Expiry: ${signalData.expiryDate} (${signalData.expiryType})
⚡ Bias: ${signalData.overallOptionBias}
🔢 Lots: ${numLots} (${totalQuantity} shares | Lot Size: ${lotSize})

📋 LEGS TO EXECUTE:
${legsText}

💰 Net Premium: ₹${netDebitCreditPerShare} (${strat.isNetCredit ? 'Net Credit' : 'Net Debit'})
💼 Total Cash Outflow / Margin: ~₹${approxMarginRequired.toLocaleString('en-IN')}
🎯 Target Premium: ₹${strat.targetExitPremium}
🛑 Stop Loss Premium: ₹${strat.stopLossExitPremium}
📈 Breakeven: ${strat.breakevenPoints.map((b) => `₹${b}`).join(', ')}
📊 Probability of Profit: ${strat.probabilityOfProfitPercent}%

⚠️ SEBI Statutory Disclaimer: Educational research signal only. Option trading involves substantial market risk.
    `.trim();

    navigator.clipboard.writeText(text);
    setCopiedTrade(true);
    setTimeout(() => setCopiedTrade(false), 2200);
  };

  return (
    <div className="space-y-6">
      {/* SEBI F&O Risk Banner */}
      <div className="p-3.5 bg-amber-950/20 border border-amber-500/30 rounded-xl flex items-start gap-3 text-amber-200/90 text-xs">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold text-amber-300">SEBI F&O Risk Disclosure: </span>
          9 out of 10 individual traders in equity derivative segment incurred net losses. Options have finite expiry and time decay (Theta). Always deploy defined-risk strategies with strict position sizing.
        </div>
      </div>

      {/* Main Signal Highlight Header */}
      <div className="bg-[#111318] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-2xl sm:text-3xl font-black font-mono text-white">
                {signalData.ticker}
              </span>
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-[#0d0f14] text-slate-300 border border-slate-700 font-mono">
                Spot: ₹{signalData.spotPrice.toLocaleString('en-IN')}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getBiasBadge(signalData.overallOptionBias)} flex items-center gap-1`}>
                <Zap className="w-3 h-3" />
                {signalData.overallOptionBias}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              F&O Lot Size: <span className="font-mono text-slate-200 font-bold">{lotSize} Qty</span> • Days to Expiry:{' '}
              <span className="font-mono text-indigo-300 font-bold">{signalData.daysToExpiry} Days</span> ({signalData.expiryDate})
            </p>
          </div>

          {/* Expiry Selector & Trade Copy */}
          <div className="flex items-center gap-2 shrink-0">
            {onRefreshExpiry && (
              <div className="flex bg-[#08090b] p-1 rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => onRefreshExpiry('Weekly')}
                  className={`px-3 py-1 rounded font-medium transition-all ${
                    signalData.expiryType === 'Weekly'
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Weekly Expiry
                </button>
                <button
                  onClick={() => onRefreshExpiry('Monthly')}
                  className={`px-3 py-1 rounded font-medium transition-all ${
                    signalData.expiryType === 'Monthly'
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Monthly Expiry
                </button>
              </div>
            )}

            <button
              id="copy-option-ticket-btn"
              onClick={handleCopyTradeTicket}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg transition-all"
            >
              {copiedTrade ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedTrade ? 'Copied Ticket' : 'Copy F&O Order'}</span>
            </button>
          </div>
        </div>

        {/* F&O Key Derivative Indicators Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-5">
          {/* PCR Indicator */}
          <div className="p-3.5 rounded-xl bg-[#0d0f14] border border-slate-800 flex flex-col justify-between">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Activity className="w-3 h-3 text-indigo-400" /> Put-Call Ratio (PCR)
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className={`text-xl font-mono font-black ${signalData.pcrRatio >= 1.0 ? 'text-emerald-400' : signalData.pcrRatio < 0.8 ? 'text-rose-400' : 'text-amber-400'}`}>
                {signalData.pcrRatio}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                {signalData.pcrInterpretation}
              </span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full ${signalData.pcrRatio >= 1.0 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                style={{ width: `${Math.min(100, Math.max(10, signalData.pcrRatio * 50))}%` }}
              ></div>
            </div>
          </div>

          {/* Max Pain Strike */}
          <div className="p-3.5 rounded-xl bg-[#0d0f14] border border-slate-800 flex flex-col justify-between">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Target className="w-3 h-3 text-purple-400" /> Max Pain Strike
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-xl font-mono font-black text-purple-300">
                ₹{signalData.maxPainStrike.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {signalData.maxPainDistancePercent > 0 ? `+${signalData.maxPainDistancePercent}%` : `${signalData.maxPainDistancePercent}%`}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 mt-2 truncate">
              Option writer equilibrium level
            </span>
          </div>

          {/* Implied Volatility (IV) */}
          <div className="p-3.5 rounded-xl bg-[#0d0f14] border border-slate-800 flex flex-col justify-between">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-400" /> Implied Volatility (IV)
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-xl font-mono font-black text-amber-300">
                {signalData.impliedVolatility}%
              </span>
              {signalData.ivPercentile && (
                <span className="text-[10px] text-slate-400 font-mono">
                  IVP: {signalData.ivPercentile}%
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-500 mt-2 truncate">
              {signalData.impliedVolatility > 22 ? 'High Premium Pricing' : 'Fair Option Valuation'}
            </span>
          </div>

          {/* ATM Strike */}
          <div className="p-3.5 rounded-xl bg-[#0d0f14] border border-slate-800 flex flex-col justify-between">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Layers className="w-3 h-3 text-cyan-400" /> ATM Strike Reference
            </span>
            <div className="mt-1">
              <span className="text-xl font-mono font-black text-cyan-300">
                ₹{signalData.atmStrike.toLocaleString('en-IN')}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 mt-2 truncate">
              Step: ₹{signalData.optionChainSummary[1] ? Math.abs(signalData.optionChainSummary[1].strike - signalData.optionChainSummary[0].strike) : 50}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 2: Recommended Option Strategy Execution Blueprint */}
      <div className="bg-[#111318] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{strat.strategyName}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950/70 text-indigo-300 border border-indigo-800">
                  {strat.strategyType}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {strat.recommendedAction}
              </p>
            </div>
          </div>

          {/* Lot Quantity Adjuster */}
          <div className="flex items-center gap-2 bg-[#08090b] px-3 py-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
            <span className="text-xs text-slate-400 font-medium">Lots:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setNumLots((l) => Math.max(1, l - 1))}
                className="w-6 h-6 rounded bg-[#151821] hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center"
              >
                -
              </button>
              <span className="font-mono text-sm font-bold text-indigo-300 px-2">
                {numLots} ({totalQuantity} Qty)
              </span>
              <button
                onClick={() => setNumLots((l) => Math.min(25, l + 1))}
                className="w-6 h-6 rounded bg-[#151821] hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Strategy Legs Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] text-slate-400 font-mono uppercase bg-[#0d0f14]">
                <th className="py-2.5 px-3">Leg Action</th>
                <th className="py-2.5 px-3">Strike & Type</th>
                <th className="py-2.5 px-3">Estimated Premium</th>
                <th className="py-2.5 px-3">Option Delta</th>
                <th className="py-2.5 px-3">Total Cost / Value</th>
                <th className="py-2.5 px-3">Leg Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {strat.legs.map((leg, idx) => {
                const isBuy = leg.action === 'BUY';
                const legCost = Math.round(leg.approxPremium * totalQuantity);
                return (
                  <tr key={idx} className="hover:bg-slate-850/50">
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                          isBuy
                            ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-800'
                            : 'bg-rose-950/70 text-rose-400 border border-rose-800'
                        }`}
                      >
                        {leg.action} ({numLots} Lot)
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-white text-sm">
                        ₹{leg.strike}
                      </span>{' '}
                      <span
                        className={`font-bold ${
                          leg.optionType === 'CE' ? 'text-green-400' : 'text-amber-400'
                        }`}
                      >
                        {leg.optionType}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-200">
                      ₹{leg.approxPremium.toFixed(1)}
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      {leg.delta !== undefined ? (leg.delta > 0 ? `+${leg.delta}` : leg.delta) : '—'}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-200">
                      {isBuy ? `-₹${legCost.toLocaleString('en-IN')}` : `+₹${legCost.toLocaleString('en-IN')}`}
                    </td>
                    <td className="py-3 px-3 font-sans text-xs text-slate-400">
                      {isBuy ? 'Directional Upside Capture' : 'Finance Premium & Cap Theta'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Strategy Financial Metrics Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#0d0f14] p-4 rounded-xl border border-slate-800">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
              Net Premium / Lot
            </span>
            <div className="mt-1 text-sm font-bold font-mono text-white">
              ₹{netDebitCreditPerShare} ({strat.isNetCredit ? 'Credit' : 'Debit'})
            </div>
            <span className="text-[10px] text-slate-500">
              Total: ₹{totalNetPremium.toLocaleString('en-IN')}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
              Max Profit
            </span>
            <div className="mt-1 text-sm font-bold font-mono text-emerald-400">
              {strat.maxProfit}
            </div>
            <span className="text-[10px] text-slate-500">
              R:R {strat.riskRewardRatio}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
              Max Defined Risk
            </span>
            <div className="mt-1 text-sm font-bold font-mono text-rose-400">
              {strat.maxLoss}
            </div>
            <span className="text-[10px] text-slate-500">
              Capped downside protection
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
              Win Probability (POP)
            </span>
            <div className="mt-1 text-sm font-bold font-mono text-indigo-300">
              {strat.probabilityOfProfitPercent}% Probability
            </div>
            <span className="text-[10px] text-slate-500">
              Breakeven: {strat.breakevenPoints.map((b) => `₹${b}`).join(', ')}
            </span>
          </div>
        </div>

        {/* Strategy Execution Rules & Trigger Points */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-[#0d0f14] border border-slate-800/80 rounded-xl">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Entry Trigger Condition
            </span>
            <p className="text-slate-300 mt-1 leading-relaxed text-[11px]">
              {strat.entryTrigger}
            </p>
          </div>

          <div className="p-3 bg-[#0d0f14] border border-slate-800/80 rounded-xl">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-emerald-400" /> Target & Stop Premium
            </span>
            <p className="text-slate-300 mt-1 leading-relaxed text-[11px]">
              Exit Target at Net Premium <span className="font-mono text-emerald-400 font-bold">₹{strat.targetExitPremium}</span>. Cut loss if Net Premium hits <span className="font-mono text-rose-400 font-bold">₹{strat.stopLossExitPremium}</span>.
            </p>
          </div>

          <div className="p-3 bg-[#0d0f14] border border-slate-800/80 rounded-xl">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" /> Theta & Time Decay
            </span>
            <p className="text-slate-300 mt-1 leading-relaxed text-[11px]">
              {strat.timeDecayGuidance}
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 3: Real-Time Option Chain & Open Interest (OI) Heatmap */}
      <div className="bg-[#111318] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              Live Option Chain & Open Interest (OI) Heatmap
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Institutional positioning, Call Resistance (₹{signalData.oiStructure.majorCallResistanceStrike}) vs Put Support (₹{signalData.oiStructure.majorPutSupportStrike})
            </p>
          </div>

          {/* Chain Filter Switcher */}
          <div className="flex bg-[#08090b] p-1 rounded-lg border border-slate-800 text-[11px] self-start sm:self-auto">
            <button
              onClick={() => setChainFilter('ATM_NEAR')}
              className={`px-2.5 py-1 rounded font-semibold transition-all ${
                chainFilter === 'ATM_NEAR'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ATM ± 3 Strikes
            </button>
            <button
              onClick={() => setChainFilter('ALL')}
              className={`px-2.5 py-1 rounded font-semibold transition-all ${
                chainFilter === 'ALL'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Full Chain
            </button>
          </div>
        </div>

        {/* Option Chain Table */}
        <div className="overflow-x-auto border border-slate-800 rounded-xl">
          <table className="w-full text-xs text-center">
            <thead>
              <tr className="bg-[#08090b] text-[10px] text-slate-400 font-mono uppercase border-b border-slate-800">
                <th colSpan={4} className="py-2 border-r border-slate-800 text-emerald-400 font-bold bg-emerald-950/20">
                  CALL OPTIONS (CE)
                </th>
                <th className="py-2 px-3 bg-slate-900 text-white font-black">
                  STRIKE
                </th>
                <th colSpan={4} className="py-2 border-l border-slate-800 text-rose-400 font-bold bg-rose-950/20">
                  PUT OPTIONS (PE)
                </th>
              </tr>
              <tr className="bg-[#0d0f14] text-[10px] text-slate-400 font-mono border-b border-slate-800">
                <th className="py-2 px-2">OI (Lakhs)</th>
                <th className="py-2 px-2">OI Chg %</th>
                <th className="py-2 px-2">Delta</th>
                <th className="py-2 px-2 border-r border-slate-800 text-right pr-3">LTP (₹)</th>
                <th className="py-2 px-3 bg-slate-900 text-slate-200">Price</th>
                <th className="py-2 px-2 border-l border-slate-800 text-left pl-3">LTP (₹)</th>
                <th className="py-2 px-2">Delta</th>
                <th className="py-2 px-2">OI Chg %</th>
                <th className="py-2 px-2">OI (Lakhs)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              {filteredChain.map((row, i) => {
                const isAtm = row.isAtm;
                return (
                  <tr
                    key={i}
                    className={`${
                      isAtm
                        ? 'bg-indigo-950/40 font-bold'
                        : 'hover:bg-slate-850/40'
                    }`}
                  >
                    {/* Call OI */}
                    <td className="py-2.5 px-2 text-slate-300">
                      <div className="flex items-center justify-center gap-1">
                        <span>{row.ceOiLakhs} L</span>
                      </div>
                    </td>

                    {/* Call OI Change & Buildup */}
                    <td className="py-2.5 px-2">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${getBuildupStyle(row.ceBuildup)}`}>
                        {row.ceOiChangePercent > 0 ? `+${row.ceOiChangePercent}%` : `${row.ceOiChangePercent}%`}
                      </span>
                    </td>

                    {/* Call Delta */}
                    <td className="py-2.5 px-2 text-slate-400">
                      +{row.ceDelta}
                    </td>

                    {/* Call LTP */}
                    <td className="py-2.5 px-2 border-r border-slate-800 text-right pr-3 font-bold text-emerald-400">
                      ₹{row.ceLtp}
                    </td>

                    {/* Strike Price */}
                    <td className={`py-2.5 px-3 bg-[#0d0f14] font-black text-sm ${isAtm ? 'text-yellow-400 bg-yellow-950/30' : 'text-white'}`}>
                      {row.strike}
                      {isAtm && (
                        <span className="block text-[9px] text-yellow-300 uppercase tracking-tighter">
                          ATM
                        </span>
                      )}
                    </td>

                    {/* Put LTP */}
                    <td className="py-2.5 px-2 border-l border-slate-800 text-left pl-3 font-bold text-rose-400">
                      ₹{row.peLtp}
                    </td>

                    {/* Put Delta */}
                    <td className="py-2.5 px-2 text-slate-400">
                      {row.peDelta}
                    </td>

                    {/* Put OI Change & Buildup */}
                    <td className="py-2.5 px-2">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${getBuildupStyle(row.peBuildup)}`}>
                        {row.peOiChangePercent > 0 ? `+${row.peOiChangePercent}%` : `${row.peOiChangePercent}%`}
                      </span>
                    </td>

                    {/* Put OI */}
                    <td className="py-2.5 px-2 text-slate-300">
                      <span>{row.peOiLakhs} L</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* OI Shift Narrative */}
        <div className="p-3 bg-[#0d0f14] rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
          <span className="font-bold text-indigo-300">Institutional F&O Positioning: </span>
          {signalData.oiStructure.oiShiftNarrative} Total Call OI stands at <span className="font-mono text-slate-200">{signalData.oiStructure.totalCallOiLakhs}L</span> vs Put OI at <span className="font-mono text-slate-200">{signalData.oiStructure.totalPutOiLakhs}L</span>.
        </div>
      </div>

      {/* SECTION 4: Greeks & Risk Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Greek Sensitivities */}
        <div className="bg-[#111318] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Percent className="w-4 h-4 text-cyan-400" />
            Option Greeks & Exposure
          </h4>
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0d0f14] border border-slate-800/80">
              <span className="text-slate-400">Portfolio Delta Bias</span>
              <span className="font-mono font-bold text-slate-200">{signalData.greeksAnalysis.deltaBias}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0d0f14] border border-slate-800/80">
              <span className="text-slate-400">Theta Time Decay Speed</span>
              <span className="font-mono font-bold text-amber-300">{signalData.greeksAnalysis.thetaDecaySpeed}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0d0f14] border border-slate-800/80">
              <span className="text-slate-400">Gamma Expiry Risk</span>
              <span className="font-mono font-bold text-purple-300">{signalData.greeksAnalysis.gammaRiskLevel}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0d0f14] border border-slate-800/80">
              <span className="text-slate-400">Vega (VIX Sensitivity)</span>
              <span className="font-mono font-bold text-slate-200">{signalData.greeksAnalysis.vegaSensitivity}</span>
            </div>
          </div>
        </div>

        {/* Alternative Strategies */}
        <div className="bg-[#111318] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            Alternative F&O Setups
          </h4>
          <div className="space-y-2.5">
            {signalData.alternativeSetups.map((alt, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-[#0d0f14] border border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white">{alt.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                    {alt.style}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {alt.description}
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                  <span>Legs: {alt.keyLegs}</span>
                  <span className="text-indigo-300">{alt.marginRequired}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
