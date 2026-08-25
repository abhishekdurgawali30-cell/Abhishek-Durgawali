import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { StockSearchForm } from './components/StockSearchForm';
import { StockAnalysisCard } from './components/StockAnalysisCard';
import { OptionsTerminalView } from './components/OptionsTerminalView';
import { MarketPulseView } from './components/MarketPulseView';
import { StockComparatorView } from './components/StockComparatorView';
import { PositionRiskCalculator } from './components/PositionRiskCalculator';
import { WatchlistJournal } from './components/WatchlistJournal';
import { StockAnalysisReport, TimeHorizon } from './types';
import { AlertTriangle, Sparkles, TrendingUp } from 'lucide-react';

const INITIAL_DEFAULT_REPORT: StockAnalysisReport = {
  id: 'RELIANCE-default',
  timestamp: new Date().toISOString(),
  ticker: 'RELIANCE',
  exchange: 'NSE',
  companyName: 'Reliance Industries Limited',
  sector: 'Energy - Oil & Gas / Retail & Telecom',
  currentMarketPrice: 2985.40,
  priceCurrency: 'INR',
  actionableOutlook: {
    signalGrade: 'ACCUMULATE ON DIPS',
    signalRationale: 'Stock is consolidating constructively above its 50-day and 200-day EMAs. Sustained retail and Jio ARPU expansion combined with steady refining margins provide solid downside cushion near ₹2,900 support.',
    idealEntryRangeMin: 2940.00,
    idealEntryRangeMax: 2985.00,
    target1: 3150.00,
    target2: 3300.00,
    strictStopLoss: 2840.00,
    timeHorizon: 'Swing (1-4 weeks)',
    riskRewardRatio: '1:2.4',
    stopLossRiskPercent: 4.8,
    potentialRewardPercentT1: 5.5,
    potentialRewardPercentT2: 10.5,
  },
  fundamentalHealth: {
    peRatio: 27.8,
    sectorPeRatio: 31.4,
    pbRatio: 2.3,
    revenueGrowthYoYPercent: 11.5,
    profitGrowthYoYPercent: 14.2,
    debtToEquity: 0.38,
    roePercent: 14.8,
    rocePercent: 16.5,
    promoterHoldingPercent: 50.3,
    promoterPledgedPercent: 0.0,
    marketCapCr: '20,18,000 Cr',
    marketCapCategory: 'Large Cap',
  },
  technicalStructure: {
    trendDirection: 'Mild Uptrend',
    ema20: 2960.0,
    ema50: 2920.0,
    ema200: 2780.0,
    priceVsEmaSummary: 'Trading comfortably above 20, 50, and 200 daily EMAs with bullish ribbon alignment.',
    rsi14: 58.4,
    rsiStatus: 'Neutral (30-60)',
    volumeProfile: 'Steady institutional delivery volume above 60% of total traded quantity.',
    supportLevel1: 2920.0,
    supportLevel2: 2840.0,
    resistanceLevel1: 3080.0,
    resistanceLevel2: 3200.0,
    chartPatternDetected: 'Ascending Consolidation Channel',
  },
  marketContext: {
    sector: 'Energy & Conglomerate',
    sectorTrend: 'Bullish',
    niftyBiasImpact: 'High beta constituent representing ~9.5% weight in Nifty 50; strong correlation with index breakout.',
    bankNiftyBiasImpact: 'Neutral correlation with banking index.',
    recentNewsOrCatalysts: [
      'New Energy solar giga-factory commissioning on schedule in Jamnagar',
      'Jio telecom tariff adjustments boosting average revenue per user (ARPU) metrics',
    ],
    upcomingEvents: ['Quarterly Board Meeting for Financial Results', 'Annual Shareholders Conclave'],
  },
  topStrengths: [
    'Clean balance sheet with zero promoter pledged shares and declining net debt',
    'Market leadership across telecom (Jio 480M+ subscribers) and organized retail (18,000+ stores)',
    'Price holding firm above 200-day EMA cushion (₹2,780) indicating structural institutional support',
  ],
  topRisks: [
    'Global crude oil refining margin volatility influenced by OPEC+ output decisions',
    'Heavy capex intensity in 5G rollout and renewable energy infrastructure assets',
  ],
  riskMetrics: {
    volatility: 'Low',
    stopLossRiskPercent: 4.8,
    riskCategory: 'Conservative',
    maxRecommendedPortfolioWeightPercent: 10.0,
  },
  summaryVerdict: 'Accumulate in the ₹2,940 - ₹2,985 zone with a strict stop loss at ₹2,840 for swing targets of ₹3,150 (T1) and ₹3,300 (T2). Long-term fundamental investors can continue SIP accumulation.',
  sebiDisclaimer: 'REGULATORY DISCLAIMER: Educational and market research purposes ONLY. Consult a SEBI-registered Investment Adviser.',
  optionSignal: {
    id: 'FOSIG-RELIANCE-default',
    ticker: 'RELIANCE',
    companyName: 'Reliance Industries Limited',
    spotPrice: 2985.4,
    lotSize: 250,
    expiryDate: 'Thursday (Weekly)',
    expiryType: 'Weekly',
    daysToExpiry: 3,
    atmStrike: 3000,
    impliedVolatility: 16.4,
    ivPercentile: 48.0,
    pcrRatio: 1.18,
    pcrInterpretation: 'Bullish (>1.0)',
    maxPainStrike: 2980,
    maxPainDistancePercent: -0.18,
    overallOptionBias: 'MILD BULLISH',
    primarySignalSetup: {
      strategyName: 'Bull Call Spread (Defined Risk)',
      strategyType: 'Defined-Risk Spread',
      bias: 'Bullish',
      legs: [
        {
          action: 'BUY',
          optionType: 'CE',
          strike: 3000,
          approxPremium: 38.5,
          lotMultiplier: 1,
          delta: 0.51,
          iv: 16.4,
          oiLakhs: 42.5,
          oiChangePercent: 14.2,
        },
        {
          action: 'SELL',
          optionType: 'CE',
          strike: 3040,
          approxPremium: 16.2,
          lotMultiplier: 1,
          delta: 0.29,
          iv: 16.0,
          oiLakhs: 72.8,
          oiChangePercent: 22.5,
        },
      ],
      netPremium: 22.3,
      isNetCredit: false,
      maxProfit: '₹4,425 per lot (₹17.7/share)',
      maxLoss: '₹5,575 per lot (Net Debit paid)',
      riskRewardRatio: '1:1.8',
      breakevenPoints: [3022.3],
      probabilityOfProfitPercent: 65,
      recommendedAction: 'Buy 1 Lot RELIANCE 3000 CE and sell 3040 CE to cushion theta decay while capturing upside expansion toward ₹3,080.',
      entryTrigger: 'Spot price sustaining firmly above ₹2,980 with institutional delivery support.',
      targetExitPremium: 36.5,
      stopLossExitPremium: 10.0,
      timeDecayGuidance: 'Sold 3040 CE offsets 65% of daily theta decay.',
      marginApproxPerLot: 40500,
    },
    alternativeSetups: [
      {
        name: 'Covered Call / Income Generation',
        bias: 'Neutral',
        style: 'Cash Flow Strategy',
        description: 'Hold delivery equity and sell 3080 CE to pocket premium decay in range-bound conditions.',
        keyLegs: 'Hold Equity Delivery + Sell 3080 CE @ ₹8.5',
        riskReward: 'Defined Income + Upside Cap',
        marginRequired: 'Equity Delivery + Standard F&O Margin',
      },
    ],
    optionChainSummary: [
      { strike: 2940, ceLtp: 72.5, ceOiLakhs: 18.2, ceOiChangePercent: -8.4, ceIv: 17.2, ceDelta: 0.82, ceBuildup: 'Short Covering', isAtm: false, peLtp: 11.2, peOiLakhs: 64.5, peOiChangePercent: 18.5, peIv: 16.8, peDelta: -0.18, peBuildup: 'Short Buildup' },
      { strike: 2960, ceLtp: 56.0, ceOiLakhs: 24.5, ceOiChangePercent: -4.2, ceIv: 16.8, ceDelta: 0.71, ceBuildup: 'Short Covering', isAtm: false, peLtp: 18.0, peOiLakhs: 78.2, peOiChangePercent: 24.0, peIv: 16.5, peDelta: -0.29, peBuildup: 'Short Buildup' },
      { strike: 2980, ceLtp: 44.5, ceOiLakhs: 36.0, ceOiChangePercent: 8.5, ceIv: 16.5, ceDelta: 0.58, ceBuildup: 'Long Buildup', isAtm: false, peLtp: 28.5, peOiLakhs: 85.0, peOiChangePercent: 15.8, peIv: 16.4, peDelta: -0.42, peBuildup: 'Short Buildup' },
      { strike: 3000, ceLtp: 38.5, ceOiLakhs: 58.4, ceOiChangePercent: 14.2, ceIv: 16.4, ceDelta: 0.51, ceBuildup: 'Long Buildup', isAtm: true, peLtp: 42.0, peOiLakhs: 52.0, peOiChangePercent: 12.0, peIv: 16.4, peDelta: -0.49, peBuildup: 'Long Buildup' },
      { strike: 3020, ceLtp: 26.0, ceOiLakhs: 68.5, ceOiChangePercent: 18.4, ceIv: 16.2, ceDelta: 0.39, ceBuildup: 'Short Buildup', isAtm: false, peLtp: 60.5, peOiLakhs: 34.0, peOiChangePercent: -6.5, peIv: 16.5, peDelta: -0.61, peBuildup: 'Long Unwinding' },
      { strike: 3040, ceLtp: 16.2, ceOiLakhs: 88.0, ceOiChangePercent: 22.5, ceIv: 16.0, ceDelta: 0.29, ceBuildup: 'Short Buildup', isAtm: false, peLtp: 84.0, peOiLakhs: 18.5, peOiChangePercent: -12.0, peIv: 16.7, peDelta: -0.71, peBuildup: 'Long Unwinding' },
      { strike: 3060, ceLtp: 9.8, ceOiLakhs: 75.2, ceOiChangePercent: 14.0, ceIv: 15.8, ceDelta: 0.19, ceBuildup: 'Short Buildup', isAtm: false, peLtp: 110.0, peOiLakhs: 10.2, peOiChangePercent: -15.4, peIv: 17.0, peDelta: -0.81, peBuildup: 'Long Unwinding' },
    ],
    oiStructure: {
      majorCallResistanceStrike: 3040,
      majorCallResistanceOi: '88.0 Lakhs OI (Heavy Call Writing)',
      majorPutSupportStrike: 2980,
      majorPutSupportOi: '85.0 Lakhs OI (Key Put Support Floor)',
      totalCallOiLakhs: 368.8,
      totalPutOiLakhs: 342.2,
      oiShiftNarrative: 'Heavy Call writing at ₹3,040 establishes immediate ceiling, while Put writers aggressively defending ₹2,980 provide downside support cushion.',
    },
    greeksAnalysis: {
      deltaBias: 'Net Positive Delta (+0.48)',
      gammaRiskLevel: 'Moderate',
      thetaDecaySpeed: 'Moderate (₹12-₹16/lot/day)',
      vegaSensitivity: '₹450 per 1% change in IV',
    },
    sebiFnoWarning: 'SEBI DERIVATIVE WARNING: 9 out of 10 individual traders in F&O incurred net losses. Trade with strict risk control.',
  },
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'analyze' | 'options' | 'market-pulse' | 'comparator' | 'calculator' | 'watchlist'>('analyze');
  const [currentReport, setCurrentReport] = useState<StockAnalysisReport | null>(INITIAL_DEFAULT_REPORT);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [watchlist, setWatchlist] = useState<StockAnalysisReport[]>(() => {
    try {
      const saved = localStorage.getItem('bharat_equity_watchlist');
      return saved ? JSON.parse(saved) : [INITIAL_DEFAULT_REPORT];
    } catch {
      return [INITIAL_DEFAULT_REPORT];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('bharat_equity_watchlist', JSON.stringify(watchlist));
    } catch (e) {
      console.error('Failed to save watchlist to localStorage', e);
    }
  }, [watchlist]);

  const handleAnalyze = async (params: {
    ticker: string;
    exchange: 'NSE' | 'BSE';
    cmp?: number;
    timeHorizon: TimeHorizon;
    customContext?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    setActiveTab('analyze');

    try {
      const res = await fetch('/api/analyze-stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Analysis failed. Please verify ticker.');
      }

      setCurrentReport(data);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message || 'Failed to scan ticker. Please check your internet connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToWatchlist = (report: StockAnalysisReport) => {
    setWatchlist((prev) => {
      const exists = prev.some((item) => item.ticker === report.ticker);
      if (exists) {
        return prev.filter((item) => item.ticker !== report.ticker);
      }
      return [report, ...prev];
    });
  };

  const handleRemoveFromWatchlist = (id: string) => {
    setWatchlist((prev) => prev.filter((item) => item.id !== id));
  };

  const isSavedInWatchlist = currentReport
    ? watchlist.some((item) => item.ticker === currentReport.ticker)
    : false;

  return (
    <div className="min-h-screen bg-[#08090b] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        watchlistCount={watchlist.length}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-5 space-y-5">
        {/* SEBI Statutory Disclaimer Banner */}
        <DisclaimerBanner />

        {/* Tab 1: Single Stock Deep Scan */}
        {activeTab === 'analyze' && (
          <div className="space-y-5">
            {/* Search and Ticker Input Form */}
            <StockSearchForm onAnalyze={handleAnalyze} isLoading={isLoading} />

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 text-red-300 text-xs flex items-center gap-2 shadow-inner">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Loading Skeleton */}
            {isLoading && (
              <div className="bg-[#111318] border border-slate-800 rounded-2xl p-12 text-center shadow-2xl">
                <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h3 className="text-base font-bold text-white">Analyzing Indian Equity Structure...</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
                  Pulling live NSE/BSE price data, calculating 20/50/200 EMAs, RSI, support/resistance, YoY financials, and promoter pledging status with Gemini AI.
                </p>
              </div>
            )}

            {/* Analysis Card */}
            {!isLoading && currentReport && (
              <StockAnalysisCard
                report={currentReport}
                onSaveToWatchlist={handleSaveToWatchlist}
                isSaved={isSavedInWatchlist}
              />
            )}
          </div>
        )}

        {/* Tab 2: Option Trading Signals & F&O Matrix */}
        {activeTab === 'options' && <OptionsTerminalView />}

        {/* Tab 3: Market & Sectors Pulse */}
        {activeTab === 'market-pulse' && <MarketPulseView />}

        {/* Tab 4: Peer Comparison */}
        {activeTab === 'comparator' && <StockComparatorView />}

        {/* Tab 4: Position Sizing & Risk Calculator */}
        {activeTab === 'calculator' && (
          <PositionRiskCalculator
            defaultEntry={currentReport?.actionableOutlook.idealEntryRangeMin || 2940}
            defaultStopLoss={currentReport?.actionableOutlook.strictStopLoss || 2840}
            defaultTarget1={currentReport?.actionableOutlook.target1 || 3150}
            defaultTarget2={currentReport?.actionableOutlook.target2 || 3300}
            defaultTicker={currentReport?.ticker || 'RELIANCE'}
          />
        )}

        {/* Tab 5: Watchlist & Journal */}
        {activeTab === 'watchlist' && (
          <WatchlistJournal
            savedReports={watchlist}
            onRemove={handleRemoveFromWatchlist}
            onSelect={(report) => {
              setCurrentReport(report);
              setActiveTab('analyze');
            }}
            onReAnalyze={(ticker) => {
              handleAnalyze({
                ticker,
                exchange: 'NSE',
                timeHorizon: 'Swing (1-4 weeks)',
              });
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#08090b] py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">Bharat Equity Analyst</span>
            <span>• Built for Indian NSE & BSE Equities</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Compliant with SEBI Educational Research Guidelines • Gemini AI Grounded Intelligence
          </p>
        </div>
      </footer>
    </div>
  );
}
