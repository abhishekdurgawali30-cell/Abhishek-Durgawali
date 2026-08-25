import React, { useState } from 'react';
import { Calculator, ShieldAlert, Target, DollarSign, PieChart, Sparkles } from 'lucide-react';

interface PositionRiskCalculatorProps {
  defaultEntry?: number;
  defaultStopLoss?: number;
  defaultTarget1?: number;
  defaultTarget2?: number;
  defaultTicker?: string;
}

export const PositionRiskCalculator: React.FC<PositionRiskCalculatorProps> = ({
  defaultEntry = 2850,
  defaultStopLoss = 2740,
  defaultTarget1 = 3050,
  defaultTarget2 = 3200,
  defaultTicker = 'RELIANCE',
}) => {
  const [totalCapital, setTotalCapital] = useState<number>(500000); // 5 Lakh INR default
  const [riskPercent, setRiskPercent] = useState<number>(1.5); // 1.5% max risk per trade
  const [entryPrice, setEntryPrice] = useState<number>(defaultEntry);
  const [stopLossPrice, setStopLossPrice] = useState<number>(defaultStopLoss);
  const [target1Price, setTarget1Price] = useState<number>(defaultTarget1);
  const [target2Price, setTarget2Price] = useState<number>(defaultTarget2);

  // Calculations
  const riskPerShare = Math.max(entryPrice - stopLossPrice, 0.05);
  const maxRiskAmount = (totalCapital * riskPercent) / 100;
  const quantity = riskPerShare > 0 ? Math.floor(maxRiskAmount / riskPerShare) : 0;
  const totalInvestment = quantity * entryPrice;
  const actualRiskAmount = quantity * riskPerShare;
  const portfolioAllocationPercent = totalCapital > 0 ? ((totalInvestment / totalCapital) * 100).toFixed(1) : '0';

  const rewardPerShareT1 = Math.max(target1Price - entryPrice, 0);
  const rewardPerShareT2 = Math.max(target2Price - entryPrice, 0);
  const totalProfitT1 = quantity * rewardPerShareT1;
  const totalProfitT2 = quantity * rewardPerShareT2;
  const rrRatioT1 = riskPerShare > 0 ? (rewardPerShareT1 / riskPerShare).toFixed(2) : '0';
  const rrRatioT2 = riskPerShare > 0 ? (rewardPerShareT2 / riskPerShare).toFixed(2) : '0';

  return (
    <div className="bg-[#111318] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Calculator className="w-5 h-5 text-indigo-400" />
          Indian Equities Position Sizing & Risk Calculator
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Calculate strict capital at risk, mathematical share quantity, and expected profit at target levels before placing NSE/BSE orders
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="space-y-4 bg-[#08090b] p-4 rounded-xl border border-slate-800 shadow-inner">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            1. Capital & Trade Parameters
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Total Trading Capital (INR ₹)
            </label>
            <input
              type="number"
              value={totalCapital}
              onChange={(e) => setTotalCapital(Math.max(parseFloat(e.target.value) || 0, 0))}
              className="w-full px-3 py-2 bg-[#0d0f14] border border-slate-750 rounded-lg text-white font-mono text-sm font-bold focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            <div className="flex gap-1.5 mt-1.5 text-[11px] font-mono">
              {[100000, 250000, 500000, 1000000, 2500000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setTotalCapital(amt)}
                  className="px-2 py-0.5 rounded bg-[#111318] border border-slate-800 text-slate-300 hover:text-white transition-colors"
                >
                  ₹{amt >= 100000 ? `${amt / 100000}L` : amt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-400 mb-1">
              <span>Risk Tolerance Per Trade:</span>
              <span className="font-mono text-indigo-400 font-bold">{riskPercent}% (₹{maxRiskAmount.toLocaleString('en-IN')})</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="5"
              step="0.25"
              value={riskPercent}
              onChange={(e) => setRiskPercent(parseFloat(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0.5% (Conservative)</span>
              <span>1.5% - 2% (Standard Swing)</span>
              <span>5% (High Risk)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Entry Price (₹)</label>
              <input
                type="number"
                step="0.05"
                value={entryPrice}
                onChange={(e) => setEntryPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-[#0d0f14] border border-slate-750 rounded-lg text-white font-mono text-sm font-bold focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-red-400 mb-1">Strict Stop Loss (₹)</label>
              <input
                type="number"
                step="0.05"
                value={stopLossPrice}
                onChange={(e) => setStopLossPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-[#0d0f14] border border-red-500/40 rounded-lg text-red-300 font-mono text-sm font-bold focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-green-400 mb-1">Target 1 (₹)</label>
              <input
                type="number"
                step="0.05"
                value={target1Price}
                onChange={(e) => setTarget1Price(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-[#0d0f14] border border-green-500/40 rounded-lg text-green-300 font-mono text-sm font-bold focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-green-300 mb-1">Target 2 (₹)</label>
              <input
                type="number"
                step="0.05"
                value={target2Price}
                onChange={(e) => setTarget2Price(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-[#0d0f14] border border-green-400/40 rounded-lg text-green-200 font-mono text-sm font-bold focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Output Metrics */}
        <div className="space-y-4 bg-[#08090b] p-4 rounded-xl border border-slate-800 shadow-inner flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>2. Calculated Order Blueprint</span>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-mono font-bold border border-indigo-500/40">
                SEBI Risk Safe
              </span>
            </h3>

            {/* Key Number: Recommended Quantity */}
            <div className="bg-[#0d0f14] border border-slate-700/80 rounded-xl p-4 text-center ring-1 ring-indigo-500/40">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                Recommended Quantity to Buy
              </span>
              <div className="text-3xl sm:text-4xl font-black font-mono text-indigo-400 mt-1">
                {quantity} <span className="text-base font-normal text-slate-400">Shares</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Capital Required: <strong className="text-white font-mono">₹{totalInvestment.toLocaleString('en-IN')}</strong> ({portfolioAllocationPercent}% of portfolio)
              </p>
            </div>

            {/* Breakdown Grid */}
            <div className="grid grid-cols-2 gap-3 mt-3 text-xs">
              <div className="bg-red-950/20 border border-red-500/30 p-2.5 rounded-lg">
                <div className="text-[10px] text-red-400 font-bold uppercase flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" /> Max Capital At Risk
                </div>
                <div className="text-base font-bold font-mono text-red-300 mt-0.5">
                  ₹{actualRiskAmount.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
                  ₹{riskPerShare.toFixed(1)} / share
                </div>
              </div>

              <div className="bg-green-950/20 border border-green-500/30 p-2.5 rounded-lg">
                <div className="text-[10px] text-green-400 font-bold uppercase flex items-center gap-1">
                  <Target className="w-3 h-3" /> Potential Profit @ T1
                </div>
                <div className="text-base font-bold font-mono text-green-300 mt-0.5">
                  +₹{totalProfitT1.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-green-400 mt-0.5 font-mono">
                  R:R 1:{rrRatioT1}
                </div>
              </div>

              <div className="bg-green-950/30 border border-green-400/40 p-2.5 rounded-lg col-span-2">
                <div className="flex justify-between items-center">
                  <div className="text-[10px] text-green-300 font-bold uppercase flex items-center gap-1">
                    <Target className="w-3 h-3" /> Potential Profit @ Target 2
                  </div>
                  <span className="text-xs font-mono font-bold text-green-400">R:R 1:{rrRatioT2}</span>
                </div>
                <div className="text-lg font-bold font-mono text-green-200 mt-0.5">
                  +₹{totalProfitT2.toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 leading-relaxed">
            💡 <strong className="text-slate-300">Risk Discipline Rule:</strong> Never risk more than 2% of total trading account equity on a single swing position. Always place a stop-loss order (GTT / SL-L) on your trading terminal (Zerodha, Groww, AngelOne, Upstox).
          </div>
        </div>
      </div>
    </div>
  );
};
