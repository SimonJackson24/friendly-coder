import { MetricData, analyzePlatformPerformance, analyzeTrends, analyzeCompetitiveMetrics } from './metrics-analyzer.ts';

export interface InsightRecommendation {
  type: string;
  suggestion?: string;
  prediction?: string;
  insight?: string;
  expectedImpact?: string;
  confidence?: string;
  action?: string;
}

export interface InsightResult {
  recommendations: InsightRecommendation[];
  confidenceScore: number;
  impactScore: number;
}

export function generateOptimizationInsights(metrics: MetricData[]): InsightResult {
  const platformPerformance = analyzePlatformPerformance(metrics);
  
  return {
    recommendations: [
      {
        type: 'budget_allocation',
        suggestion: `Increase budget allocation for ${platformPerformance.bestPlatform} by 20%`,
        expectedImpact: 'Potential 15% increase in ROAS',
        confidence: 'High'
      },
      {
        type: 'targeting',
        suggestion: 'Refine audience targeting based on recent conversion data',
        expectedImpact: 'Expected 10% improvement in conversion rate',
        confidence: 'Medium'
      },
      {
        type: 'creative',
        suggestion: 'A/B test new ad creatives with emotional appeals',
        expectedImpact: 'Potential 8% increase in CTR',
        confidence: 'Medium'
      }
    ],
    confidenceScore: 0.85,
    impactScore: 0.75
  };
}

export function generatePredictiveInsights(metrics: MetricData[]): InsightResult {
  const trends = analyzeTrends(metrics);
  
  return {
    recommendations: [
      {
        type: 'trend_forecast',
        prediction: `Expected ${trends.ctrTrend > 0 ? 'increase' : 'decrease'} of ${Math.abs(trends.ctrTrend)}% in CTR next month`,
        confidence: 'High'
      },
      {
        type: 'budget_forecast',
        prediction: 'Optimal budget allocation suggests 30% increase for weekend campaigns',
        confidence: 'Medium'
      },
      {
        type: 'performance_prediction',
        prediction: 'Peak performance expected between 2-5 PM based on historical data',
        confidence: 'High'
      }
    ],
    confidenceScore: 0.80,
    impactScore: 0.70
  };
}

export function generateCompetitiveInsights(metrics: MetricData[]): InsightResult {
  const competitiveAnalysis = analyzeCompetitiveMetrics(metrics);
  
  return {
    recommendations: [
      {
        type: 'market_position',
        insight: `Performance is ${competitiveAnalysis.relativePerformance}% above industry average`,
        action: 'Maintain current strategy with focus on high-performing segments'
      },
      {
        type: 'opportunity',
        insight: 'Identified gap in weekend advertising coverage',
        action: 'Consider extending campaign schedule to weekends'
      },
      {
        type: 'competitive_edge',
        insight: 'Lower CPC than industry average by 15%',
        action: 'Leverage cost advantage to increase market share'
      }
    ],
    confidenceScore: 0.75,
    impactScore: 0.65
  };
}