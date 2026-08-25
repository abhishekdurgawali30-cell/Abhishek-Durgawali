export type SignalGrade = 
  | 'STRONGLY BULLISH / BUY'
  | 'ACCUMULATE ON DIPS'
  | 'NEUTRAL / HOLD'
  | 'BEARISH / REDUCE';

export type TimeHorizon = 
  | 'Intraday'
  | 'Swing (1-4 weeks)'
  | 'Positional (1-3 months)'
  | 'Long-Term (1-3 years)';

export type VolatilityRating = 'Low' | 'Medium' | 'High' | 'Very High';

export interface FundamentalHealth {
  peRatio: number | null;
  sectorPeRatio: number | null;
  pbRatio?: number | null;
  revenueGrowthYoYPercent: number | null;
  profitGrowthYoYPercent: number | null;
  debtToEquity: number | null;
  roePercent: number | null;
  rocePercent: number | null;
  promoterHoldingPercent: number | null;
  promoterPledgedPercent: number | null;
  marketCapCr: number | string | null;
  marketCapCategory?: 'Large Cap' | 'Mid Cap' | 'Small Cap' | 'Micro Cap';
}

export interface TechnicalStructure {
  trendDirection: 'Strong Uptrend' | 'Mild Uptrend' | 'Consolidation / Sideways' | 'Mild Downtrend' | 'Strong Downtrend';
  ema20: number | null;
  ema50: number | null;
  ema200: number | null;
  priceVsEmaSummary: string;
  rsi14: number | null;
  rsiStatus: 'Oversold (<30)' | 'Neutral (30-60)' | 'Bullish Momentum (60-70)' | 'Overbought (>70)';
  volumeProfile: string;
  supportLevel1: number;
  supportLevel2: number;
  resistanceLevel1: number;
  resistanceLevel2: number;
  chartPatternDetected?: string;
}

export interface MarketContext {
  sector: string;
  sectorTrend: 'Bullish' | 'Neutral' | 'Bearish';
  niftyBiasImpact: string;
  bankNiftyBiasImpact?: string;
  recentNewsOrCatalysts: string[];
  upcomingEvents?: string[]; // e.g. Earnings, RBI Policy, Dividend
}

export interface ActionableOutlook {
  signalGrade: SignalGrade;
  signalRationale: string;
  idealEntryRangeMin: number;
  idealEntryRangeMax: number;
  target1: number;
  target2: number;
  strictStopLoss: number;
  timeHorizon: TimeHorizon;
  riskRewardRatio: string;
  stopLossRiskPercent: number;
  potentialRewardPercentT1: number;
  potentialRewardPercentT2: number;
}

export interface StockAnalysisReport {
  id: string;
  timestamp: string;
  ticker: string;
  exchange: 'NSE' | 'BSE' | 'NSE/BSE';
  companyName: string;
  sector: string;
  currentMarketPrice: number;
  priceCurrency: 'INR';
  actionableOutlook: ActionableOutlook;
  fundamentalHealth: FundamentalHealth;
  technicalStructure: TechnicalStructure;
  marketContext: MarketContext;
  topStrengths: string[]; // Top 3 strengths
  topRisks: string[]; // Top 2 risks
  riskMetrics: {
    volatility: VolatilityRating;
    stopLossRiskPercent: number;
    riskCategory: 'Conservative' | 'Moderate' | 'Aggressive' | 'Speculative';
    maxRecommendedPortfolioWeightPercent?: number;
  };
  summaryVerdict: string;
  sebiDisclaimer: string;
  optionSignal?: OptionSignalReport;
  groundingSources?: Array<{ title: string; uri: string }>;
}

export type OptionBias = 
  | 'STRONG BULLISH CALLS'
  | 'MILD BULLISH'
  | 'RANGE-BOUND / THETA HARVEST'
  | 'MILD BEARISH'
  | 'STRONG BEARISH PUTS';

export type OiBuildupType = 'Long Buildup' | 'Short Covering' | 'Short Buildup' | 'Long Unwinding' | 'Neutral';

export interface OptionLeg {
  action: 'BUY' | 'SELL';
  optionType: 'CE' | 'PE';
  strike: number;
  approxPremium: number;
  lotMultiplier?: number;
  delta?: number;
  iv?: number;
  oiLakhs?: number;
  oiChangePercent?: number;
}

export interface OptionStrategySetup {
  strategyName: string;
  strategyType: 'Directional Momentum' | 'Defined-Risk Spread' | 'Theta Decay / Delta Neutral' | 'Volatility Expansion';
  bias: 'Bullish' | 'Bearish' | 'Neutral' | 'Volatile';
  legs: OptionLeg[];
  netPremium: number; // Positive for Debit, Negative for Credit
  isNetCredit: boolean;
  maxProfit: string;
  maxLoss: string;
  riskRewardRatio: string;
  breakevenPoints: number[];
  probabilityOfProfitPercent: number;
  recommendedAction: string;
  entryTrigger: string;
  targetExitPremium: number;
  stopLossExitPremium: number;
  timeDecayGuidance: string;
  marginApproxPerLot: number;
}

export interface OptionChainRow {
  strike: number;
  ceLtp: number;
  ceOiLakhs: number;
  ceOiChangePercent: number;
  ceIv: number;
  ceDelta: number;
  ceBuildup: OiBuildupType;
  isAtm: boolean;
  peLtp: number;
  peOiLakhs: number;
  peOiChangePercent: number;
  peIv: number;
  peDelta: number;
  peBuildup: OiBuildupType;
}

export interface OptionSignalReport {
  id: string;
  ticker: string;
  companyName: string;
  spotPrice: number;
  lotSize: number;
  expiryDate: string;
  expiryType: 'Weekly' | 'Monthly';
  daysToExpiry: number;
  atmStrike: number;
  impliedVolatility: number;
  ivPercentile?: number;
  pcrRatio: number;
  pcrInterpretation: 'Bullish (>1.0)' | 'Bearish (<0.8)' | 'Neutral (0.8-1.0)';
  maxPainStrike: number;
  maxPainDistancePercent: number;
  overallOptionBias: OptionBias;
  primarySignalSetup: OptionStrategySetup;
  alternativeSetups: Array<{
    name: string;
    bias: 'Bullish' | 'Bearish' | 'Neutral';
    style: string;
    description: string;
    keyLegs: string;
    riskReward: string;
    marginRequired: string;
  }>;
  optionChainSummary: OptionChainRow[];
  oiStructure: {
    majorCallResistanceStrike: number;
    majorCallResistanceOi: string;
    majorPutSupportStrike: number;
    majorPutSupportOi: string;
    totalCallOiLakhs: number;
    totalPutOiLakhs: number;
    oiShiftNarrative: string;
  };
  greeksAnalysis: {
    deltaBias: string;
    gammaRiskLevel: 'Low' | 'Moderate' | 'High (Expiry Near)';
    thetaDecaySpeed: string;
    vegaSensitivity: string;
  };
  sebiFnoWarning: string;
}

export interface MarketIndicesPulse {
  nifty50: {
    level: number;
    change: number;
    percentChange: number;
    bias: 'Bullish' | 'Neutral' | 'Bearish';
    support: number;
    resistance: number;
  };
  bankNifty: {
    level: number;
    change: number;
    percentChange: number;
    bias: 'Bullish' | 'Neutral' | 'Bearish';
    support: number;
    resistance: number;
  };
  indiaVix: {
    level: number;
    status: 'Low (<13)' | 'Normal (13-18)' | 'High (>18)';
  };
  sectorHeatmap: Array<{
    name: string;
    trend: 'Bullish' | 'Neutral' | 'Bearish';
    percentChange: number;
    topGainersOrNote: string;
  }>;
  overallMarketSentiment: string;
  lastUpdated: string;
}

export interface QuickTicker {
  symbol: string;
  name: string;
  sector: string;
  approxPrice: number;
  category: 'Nifty 50 Largecap' | 'High Growth Midcap' | 'Momentum / Trending';
}
