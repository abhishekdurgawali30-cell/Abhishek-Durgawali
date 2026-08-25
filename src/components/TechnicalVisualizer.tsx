import React from 'react';
import { TechnicalStructure, ActionableOutlook } from '../types';
import { Activity, ShieldAlert, Target, TrendingUp, Layers, Compass, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface TechnicalVisualizerProps {
  technical: TechnicalStructure;
  outlook: ActionableOutlook;
  cmp: number;
}

export const TechnicalVisualizer: React.FC<TechnicalVisualizerProps> = ({ technical, outlook, cmp }) => {
  const rsi = technical.rsi14 || 50;

  // Calculate percentage positions for the price ladder
  const stopLoss = outlook.strictStopLoss;
  const entryMin = outlook.idealEntryRangeMin;
  const entryMax = outlook.idealEntryRangeMax;
  const t1 = outlook.target1;
  const t2 = outlook.target2;

  // Moving average alignment status
  const isAbove20 = technical.ema20 ? cmp >= technical.ema20 : true;
  const isAbove50 = technical.ema50 ? cmp >= technical.ema50 : true;
  const isAbove200 = technical.ema200 ? cmp >= technical.ema200 : true;

  // RSI Zone color
  const getRsiColor = (val: number) => {
    if (val < 30) return 'text-amber-400 bg-amber-500/20 border-amber-500/40';
    if (val <= 60) return 'text-indigo-400 bg-indigo-500/20 border-indigo-500/40';
    if (val <= 70) return 'text-green-400 bg-green-500/20 border-green-500/40';
    return 'text-red-400 bg-red-500/20 border-red-500/40';
  };

  return (
    <div className="space-y-4">
      {/* 1. Trade Setup Price Ladder */}
      <div className="bg-[#08090b] border border-slate-800 rounded-xl p-4 shadow-inner">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-indigo-400" />
            Execution Roadmap & Technical Price Levels (INR)
          </h4>
          <span className="text-xs font-mono text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800/60 font-semibold">
            R:R {outlook.riskRewardRatio || '1:2.5'}
          </span>
        </div>

        {/* Level Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono">
          {/* Strict Stop Loss */}
          <div className="bg-red-950/20 border border-red-500/30 rounded-lg p-2.5 text-center">
            <div className="text-[10px] text-red-400 font-sans font-bold uppercase tracking-tight flex items-center justify-center gap-1">
              <ShieldAlert className="w-3 h-3" /> Stop Loss
            </div>
            <div className="text-sm font-bold text-red-300 mt-1">₹{stopLoss?.toLocaleString('en-IN')}</div>
            <div className="text-[10px] text-red-400/80 mt-0.5">
              -{outlook.stopLossRiskPercent || ((cmp - stopLoss) / cmp * 100).toFixed(1)}% Risk
            </div>
          </div>

          {/* Entry Range */}
          <div className="bg-indigo-950/20 border border-indigo-500/30 rounded-lg p-2.5 text-center">
            <div className="text-[10px] text-indigo-400 font-sans font-bold uppercase tracking-tight">
              Ideal Entry
            </div>
            <div className="text-xs font-bold text-indigo-300 mt-1">
              ₹{entryMin?.toLocaleString('en-IN')} - {entryMax?.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-indigo-400/80 mt-0.5">Accumulation Zone</div>
          </div>

          {/* Current Market Price */}
          <div className="bg-[#0d0f14] border border-slate-700 rounded-lg p-2.5 text-center col-span-2 sm:col-span-1 ring-1 ring-indigo-500/40">
            <div className="text-[10px] text-indigo-400 font-sans font-bold uppercase tracking-tight">
              Live CMP
            </div>
            <div className="text-sm font-bold text-white mt-1">₹{cmp?.toLocaleString('en-IN')}</div>
            <div className="text-[10px] text-slate-500 mt-0.5 font-sans">Current Price</div>
          </div>

          {/* Target 1 */}
          <div className="bg-green-950/20 border border-green-500/30 rounded-lg p-2.5 text-center">
            <div className="text-[10px] text-green-400 font-sans font-bold uppercase tracking-tight flex items-center justify-center gap-1">
              <Target className="w-3 h-3" /> Target 1
            </div>
            <div className="text-sm font-bold text-green-300 mt-1">₹{t1?.toLocaleString('en-IN')}</div>
            <div className="text-[10px] text-green-400/80 mt-0.5">
              +{outlook.potentialRewardPercentT1 || (((t1 - cmp) / cmp) * 100).toFixed(1)}% Gain
            </div>
          </div>

          {/* Target 2 */}
          <div className="bg-green-950/30 border border-green-400/40 rounded-lg p-2.5 text-center">
            <div className="text-[10px] text-green-300 font-sans font-bold uppercase tracking-tight flex items-center justify-center gap-1">
              <Target className="w-3 h-3" /> Target 2
            </div>
            <div className="text-sm font-bold text-green-200 mt-1">₹{t2?.toLocaleString('en-IN')}</div>
            <div className="text-[10px] text-green-300/80 mt-0.5">
              +{outlook.potentialRewardPercentT2 || (((t2 - cmp) / cmp) * 100).toFixed(1)}% Gain
            </div>
          </div>
        </div>

        {/* Visual Progress Bar of Price Zones */}
        <div className="mt-3.5 pt-3 border-t border-slate-800/80">
          <div className="flex justify-between text-[10px] text-slate-400 font-mono mb-1">
            <span>SL: ₹{stopLoss}</span>
            <span className="text-slate-300">CMP: ₹{cmp}</span>
            <span className="text-green-400">T2: ₹{t2}</span>
          </div>
          <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden flex border border-slate-800">
            <div className="bg-red-500 h-full w-[25%]" title="Stop Loss Zone"></div>
            <div className="bg-indigo-500 h-full w-[25%]" title="Entry Accumulation Zone"></div>
            <div className="bg-teal-500 h-full w-[25%]" title="Target 1 Zone"></div>
            <div className="bg-green-400 h-full w-[25%]" title="Target 2 Expansion"></div>
          </div>
        </div>
      </div>

      {/* 2. Technical Indicators Dashboard (RSI + EMA Ribbon + Support/Resistance) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* RSI 14 Momentum */}
        <div className="bg-[#08090b] border border-slate-800 rounded-xl p-3.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-indigo-400" /> RSI (14 Period)
            </span>
            <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${getRsiColor(rsi)}`}>
              {rsi.toFixed(1)}
            </span>
          </div>

          <div className="space-y-1.5 mt-2">
            <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden relative border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-green-400 transition-all duration-500"
                style={{ width: `${Math.min(Math.max(rsi, 0), 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[9px] text-slate-500 font-mono">
              <span>0 (Oversold &lt;30)</span>
              <span>50</span>
              <span>100 (Overbought &gt;70)</span>
            </div>
            <p className="text-[11px] text-slate-300 font-medium pt-1">
              Status: <span className="text-white font-semibold">{technical.rsiStatus || 'Neutral'}</span>
            </p>
          </div>
        </div>

        {/* EMA Ribbon Alignment */}
        <div className="bg-[#08090b] border border-slate-800 rounded-xl p-3.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-indigo-400" /> Exponential Moving Avg
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Daily EMAs</span>
          </div>

          <div className="space-y-1.5 font-mono text-xs">
            <div className="flex items-center justify-between py-0.5 border-b border-slate-850">
              <span className="text-slate-400 text-[11px]">20 EMA:</span>
              <div className="flex items-center gap-1.5">
                <span className="text-white font-semibold">₹{technical.ema20 ? technical.ema20.toLocaleString('en-IN') : 'N/A'}</span>
                <span className={`text-[10px] px-1 py-0.2 rounded font-sans ${isAbove20 ? 'bg-green-950/80 text-green-400 border border-green-800/50' : 'bg-red-950/80 text-red-400 border border-red-800/50'}`}>
                  {isAbove20 ? 'Above' : 'Below'}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between py-0.5 border-b border-slate-850">
              <span className="text-slate-400 text-[11px]">50 EMA:</span>
              <div className="flex items-center gap-1.5">
                <span className="text-white font-semibold">₹{technical.ema50 ? technical.ema50.toLocaleString('en-IN') : 'N/A'}</span>
                <span className={`text-[10px] px-1 py-0.2 rounded font-sans ${isAbove50 ? 'bg-green-950/80 text-green-400 border border-green-800/50' : 'bg-red-950/80 text-red-400 border border-red-800/50'}`}>
                  {isAbove50 ? 'Above' : 'Below'}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between py-0.5">
              <span className="text-slate-400 text-[11px]">200 EMA (Trend):</span>
              <div className="flex items-center gap-1.5">
                <span className="text-white font-semibold">₹{technical.ema200 ? technical.ema200.toLocaleString('en-IN') : 'N/A'}</span>
                <span className={`text-[10px] px-1 py-0.2 rounded font-sans ${isAbove200 ? 'bg-green-950/80 text-green-400 border border-green-800/50' : 'bg-red-950/80 text-red-400 border border-red-800/50'}`}>
                  {isAbove200 ? 'Above' : 'Below'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Support & Resistance Pivot Matrix */}
        <div className="bg-[#08090b] border border-slate-800 rounded-xl p-3.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-teal-400" /> S & R Key Pivots
            </span>
            <span className="text-[10px] text-slate-500 font-mono">INR</span>
          </div>

          <div className="space-y-1 font-mono text-xs">
            <div className="flex justify-between items-center text-red-400/90 text-[11px]">
              <span>R2 Resistance:</span>
              <span className="font-bold">₹{technical.resistanceLevel2?.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center text-red-300 text-[11px]">
              <span>R1 Resistance:</span>
              <span className="font-bold">₹{technical.resistanceLevel1?.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center text-green-300 text-[11px] pt-0.5 border-t border-slate-800/80">
              <span>S1 Support:</span>
              <span className="font-bold">₹{technical.supportLevel1?.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center text-green-400/90 text-[11px]">
              <span>S2 Strong Base:</span>
              <span className="font-bold">₹{technical.supportLevel2?.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Trend Direction & Volume Note */}
      <div className="bg-[#08090b] border border-slate-800 rounded-xl p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-green-400 shrink-0" />
          <span className="text-slate-400">Technical Trend:</span>
          <span className="font-bold text-white bg-[#0d0f14] px-2.5 py-0.5 rounded border border-slate-700">
            {technical.trendDirection || 'Upward Consolidation'}
          </span>
          {technical.chartPatternDetected && (
            <span className="text-indigo-300 text-[11px] bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/60 font-mono">
              {technical.chartPatternDetected}
            </span>
          )}
        </div>
        <div className="text-slate-400 text-[11px] font-mono">
          {technical.volumeProfile || 'Volume expanding above 20-day moving average'}
        </div>
      </div>
    </div>
  );
};

