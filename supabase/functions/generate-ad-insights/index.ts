import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { corsHeaders } from '../_shared/cors.ts';
import { 
  generateOptimizationInsights, 
  generatePredictiveInsights, 
  generateCompetitiveInsights 
} from './insight-generators.ts';

interface RequestBody {
  insightType: 'optimization' | 'prediction' | 'competitive';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Initializing Supabase client...');
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch recent ad metrics for analysis
    console.log('Fetching recent ad metrics...');
    const { data: metrics, error: metricsError } = await supabaseClient
      .from('ad_metrics')
      .select('*')
      .order('date', { ascending: false })
      .limit(30);

    if (metricsError) {
      console.error('Error fetching metrics:', metricsError);
      throw metricsError;
    }

    const { insightType } = await req.json() as RequestBody;
    console.log('Generating insights for type:', insightType);

    // Generate insights based on the type
    let insights;
    switch (insightType) {
      case 'optimization':
        insights = generateOptimizationInsights(metrics);
        break;
      case 'prediction':
        insights = generatePredictiveInsights(metrics);
        break;
      case 'competitive':
        insights = generateCompetitiveInsights(metrics);
        break;
      default:
        throw new Error(`Invalid insight type: ${insightType}`);
    }

    // Store insights in the database
    console.log('Storing generated insights...');
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
      .single();

    if (error) {
      console.error('Error storing insights:', error);
      throw error;
    }

    console.log('Successfully generated and stored insights');
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error generating insights:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});