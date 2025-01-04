import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { platform, adType, currentPerformance, industry } = await req.json();

    const systemPrompt = `You are an expert digital advertising AI assistant. Generate comprehensive recommendations for ${platform} ads, focusing on:
    1. Multiple ad creative variations
    2. Image and video optimization tips
    3. Relevant keywords and hashtags
    4. Performance optimization suggestions
    
    Consider the ad type: ${adType}
    Current performance metrics: ${JSON.stringify(currentPerformance)}
    Industry: ${industry}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': Deno.env.get('ANTHROPIC_API_KEY') || '',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: "claude-3-opus-20240229",
        max_tokens: 1024,
        messages: [{ 
          role: "user", 
          content: systemPrompt 
        }],
        system: "You are an expert ad copywriter and digital marketing specialist."
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${await response.text()}`);
    }

    const data = await response.json();
    
    return new Response(
      JSON.stringify({ recommendations: data.content[0].text }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating ad recommendations:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});