import React from 'react';
import { FundamentalHealth } from '../types';
import { PieChart, TrendingUp, ShieldCheck, AlertCircle, Award, Scale } from 'lucide-react';

interface FundamentalVisualizerProps {
  fundamental: FundamentalHealth;
}

export const FundamentalVisualizer: React.FC<FundamentalVisualizerProps> = ({ fundamental }) => {
  const pe = fundamental.peRatio || 0;
  const sectorPe = fundamental.sectorPeRatio || 0;
  const isPeCheaper = pe > 0 && sectorPe > 0 ? pe < sectorPe : false;
  const roe = fundamental.roePercent || 0;
  const roce = fundamental.rocePercent || 0;
  const promoterHolding = fundamental.promoterHoldingPercent || 0;
  const pledged = fundamental.promoterPledgedPercent || 0;

  return (
    <div className="space-y-3.5">
      {/* 1. Core Valuation & Capital Efficiency Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* P/E vs Sector */}
        <div className="bg-[#08090b] border border-slate-800 rounded-xl p-3 shadow-inner">
          <div className="text-[11px] text-slate-400 font-medium flex items-center justify-between">
            <span>P/E Ratio</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${isPeCheaper ? 'bg-green-950 text-green-400 border border-green-800/40' : 'bg-slate-800 text-slate-300'}`}>
              {isPeCheaper ? 'Below Sector' : 'Premium'}
            </span>
          </div>
          <div className="text-base font-bold font-mono text-white mt-1">
            {pe > 0 ? `${pe.toFixed(1)}x` : 'N/A'}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
            Sector P/E: <span className="text-slate-300">{sectorPe > 0 ? `${sectorPe.toFixed(1)}x` : 'N/A'}</span>
          </div>
        </div>

        {/* ROCE % */}
        <div className="bg-[#08090b] border border-slate-800 rounded-xl p-3 shadow-inner">
          <div className="text-[11px] text-slate-400 font-medium flex items-center justify-between">
            <span>ROCE</span>
            <Award className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className={`text-base font-bold font-mono mt-1 ${roce >= 15 ? 'text-green-400' : 'text-slate-200'}`}>
            {roce > 0 ? `${roce.toFixed(1)}%` : 'N/A'}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {roce >= 18 ? 'Superior Efficiency' : 'Return on Capital'}
          </div>
        </div>

        {/* ROE % */}
        <div className="bg-[#08090b] border border-slate-800 rounded-xl p-3 shadow-inner">
          <div className="text-[11px] text-slate-400 font-medium flex items-center justify-between">
            <span>ROE (Equity)</span>
            <TrendingUp className="w-3.5 h-3.5 text-teal-400" />
          </div>
          <div className={`text-base font-bold font-mono mt-1 ${roe >= 15 ? 'text-green-400' : 'text-slate-200'}`}>
            {roe > 0 ? `${roe.toFixed(1)}%` : 'N/A'}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {roe >= 15 ? 'Healthy Shareholder Return' : 'Return on Equity'}
          </div>
        </div>

        {/* Debt-to-Equity */}
        <div className="bg-[#08090b] border border-slate-800 rounded-xl p-3 shadow-inner">
          <div className="text-[11px] text-slate-400 font-medium flex items-center justify-between">
            <span>Debt / Equity</span>
            <Scale className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-base font-bold font-mono text-white mt-1">
            {fundamental.debtToEquity !== null ? fundamental.debtToEquity.toFixed(2) : 'N/A'}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {fundamental.debtToEquity === 0 || (fundamental.debtToEquity !== null && fundamental.debtToEquity < 0.5) ? (
              <span className="text-green-400 font-medium">Virtually Debt Free</span>
            ) : (
              <span>Leverage Ratio</span>
            )}
          </div>
        </div>
      </div>

      {/* 2. Promoter Holding & Growth Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Promoter Holding & Pledging */}
        <div className="bg-[#08090b] border border-slate-800 rounded-xl p-3.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <PieChart className="w-3.5 h-3.5 text-purple-400" /> Ownership Structure
            </span>
            <span className="text-[10px] text-slate-500 font-mono">BSE/NSE Shareholding</span>
          </div>

          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Promoter Holding:</span>
                <span className="font-mono font-bold text-white">{promoterHolding.toFixed(1)}%</span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-purple-500 rounded-full transition-all"
                  style={{ width: `${Math.min(promoterHolding, 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="pt-1.5 border-t border-slate-850 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                {pledged > 0 ? (
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
                )}
                <span>Promoter Pledged Shares:</span>
              </div>
              <span
                className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                  pledged === 0
                    ? 'bg-green-950/80 text-green-400 border border-green-800/60'
                    : pledged < 10
                    ? 'bg-amber-950/80 text-amber-400 border border-amber-800/60'
                    : 'bg-red-950/80 text-red-400 border border-red-800/60'
                }`}
              >
                {pledged === 0 ? '0.0% (Clean)' : `${pledged.toFixed(1)}%`}
              </span>
            </div>
          </div>
        </div>

        {/* YoY Revenue & Profit Growth */}
        <div className="bg-[#08090b] border border-slate-800 rounded-xl p-3.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-green-400" /> YoY Financial Growth
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Consolidated</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between py-1 border-b border-slate-850">
              <span className="text-xs text-slate-400">Revenue Growth (YoY):</span>
              <span
                className={`text-xs font-mono font-bold ${
                  (fundamental.revenueGrowthYoYPercent || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {fundamental.revenueGrowthYoYPercent !== null
                  ? `${(fundamental.revenueGrowthYoYPercent > 0 ? '+' : '')}${fundamental.revenueGrowthYoYPercent.toFixed(1)}%`
                  : 'N/A'}
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-850">
              <span className="text-xs text-slate-400">Net Profit / PAT Growth (YoY):</span>
              <span
                className={`text-xs font-mono font-bold ${
                  (fundamental.profitGrowthYoYPercent || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {fundamental.profitGrowthYoYPercent !== null
                  ? `${(fundamental.profitGrowthYoYPercent > 0 ? '+' : '')}${fundamental.profitGrowthYoYPercent.toFixed(1)}%`
                  : 'N/A'}
              </span>
            </div>

            <div className="flex items-center justify-between pt-0.5 text-xs text-slate-400">
              <span>Market Cap:</span>
              <span className="font-mono text-slate-200 font-semibold">
                {fundamental.marketCapCr || 'N/A'} ({fundamental.marketCapCategory || 'Large Cap'})
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

