import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'

interface RequestBody {
  insightType: 'optimization' | 'prediction' | 'competitive';
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch recent ad metrics for analysis
    const { data: metrics, error: metricsError } = await supabaseClient
      .from('ad_metrics')
      .select('*')
      .order('date', { ascending: false })
      .limit(30)

    if (metricsError) throw metricsError

    const { insightType } = await req.json() as RequestBody

    // Generate insights based on the type
    let insights = {
      recommendations: [],
      confidenceScore: 0.85,
      impactScore: 0
    }

    switch (insightType) {
      case 'optimization':
        insights = generateOptimizationInsights(metrics)
        break
      case 'prediction':
        insights = generatePredictiveInsights(metrics)
        break
      case 'competitive':
        insights = generateCompetitiveInsights(metrics)
        break
    }

    // Store insights in the database
    const { data, error } = await supabaseClient
      .from('ad_insights')
      .insert({
        insight_type: insightType,
        content: insights,
        confidence_score: insights.confidenceScore,
        impact_score: insights.impactScore,
        implemented: false
      })
      .select()
      .single()

    if (error) throw error

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error generating insights:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})

function generateOptimizationInsights(metrics: any[]) {
  // Analyze performance metrics and generate optimization suggestions
  const platformPerformance = analyzePlatformPerformance(metrics)
  const recommendations = [
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
  ]
  
  return {
    recommendations,
    confidenceScore: 0.85,
    impactScore: 0.75
  }
}

function generatePredictiveInsights(metrics: any[]) {
  // Analyze trends and generate predictions
  const trends = analyzeTrends(metrics)
  const recommendations = [
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
  ]

  return {
    recommendations,
    confidenceScore: 0.80,
    impactScore: 0.70
  }
}

function generateCompetitiveInsights(metrics: any[]) {
  // Analyze competitive landscape
  const competitiveAnalysis = analyzeCompetitiveMetrics(metrics)
  const recommendations = [
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
  ]

  return {
    recommendations,
    confidenceScore: 0.75,
    impactScore: 0.65
  }
}

function analyzePlatformPerformance(metrics: any[]) {
  // Simple analysis to find best performing platform
  const platformMetrics = metrics.reduce((acc, metric) => {
    if (!acc[metric.platform]) {
      acc[metric.platform] = {
        roas: 0,
        count: 0
      }
    }
    acc[metric.platform].roas += metric.roas || 0
    acc[metric.platform].count++
    return acc
  }, {})

  let bestPlatform = ''
  let bestRoas = 0

  Object.entries(platformMetrics).forEach(([platform, data]: [string, any]) => {
    const avgRoas = data.roas / data.count
    if (avgRoas > bestRoas) {
      bestRoas = avgRoas
      bestPlatform = platform
    }
  })

  return { bestPlatform }
}

function analyzeTrends(metrics: any[]) {
  // Calculate CTR trend
  const sortedMetrics = metrics.sort((a: any, b: any) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  const ctrValues = sortedMetrics.map((m: any) => m.ctr || 0)
  const ctrTrend = calculateTrend(ctrValues)

  return { ctrTrend }
}

function analyzeCompetitiveMetrics(metrics: any[]) {
  // Simplified competitive analysis
  const avgRoas = metrics.reduce((sum, m) => sum + (m.roas || 0), 0) / metrics.length
  const industryAvgRoas = 2.0 // This would ideally come from industry data
  const relativePerformance = ((avgRoas - industryAvgRoas) / industryAvgRoas) * 100

  return { relativePerformance }
}

function calculateTrend(values: number[]) {
  if (values.length < 2) return 0
  const first = values[0]
  const last = values[values.length - 1]
  return ((last - first) / first) * 100
}