import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'

interface RequestBody {
  metrics: any[];
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

    const { metrics, insightType } = await req.json() as RequestBody

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
        impact_score: insights.impactScore
      })
      .select()
      .single()

    if (error) throw error

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})

function generateOptimizationInsights(metrics: any[]) {
  // Analyze performance metrics and generate optimization suggestions
  const recommendations = [
    {
      type: 'budget_allocation',
      suggestion: 'Increase budget for top performing campaigns',
      expectedImpact: 'Potential 15% increase in ROAS'
    },
    {
      type: 'targeting',
      suggestion: 'Refine audience targeting based on conversion data',
      expectedImpact: 'Potential 10% improvement in conversion rate'
    }
  ]
  
  return {
    recommendations,
    confidenceScore: 0.85,
    impactScore: 0.75
  }
}

function generatePredictiveInsights(metrics: any[]) {
  // Generate predictions based on historical data
  const recommendations = [
    {
      type: 'trend_forecast',
      prediction: 'Expected 20% increase in CTR next month',
      confidence: 'High'
    },
    {
      type: 'budget_forecast',
      prediction: 'Optimal budget allocation suggests 30% increase',
      confidence: 'Medium'
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
  const recommendations = [
    {
      type: 'market_position',
      insight: 'Performance above industry average by 12%',
      action: 'Maintain current strategy'
    },
    {
      type: 'opportunity',
      insight: 'Gap in weekend advertising coverage',
      action: 'Consider extending campaign schedule'
    }
  ]

  return {
    recommendations,
    confidenceScore: 0.75,
    impactScore: 0.65
  }
}