import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

console.log("Loading ad variations generator...");

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { originalContent, targetMetrics, platform } = await req.json();

    const prompt = `Generate 3 high-converting ad variations for the following original ad copy, optimized for ${platform} and focusing on improving ${targetMetrics.join(', ')}:

Original Ad: "${originalContent}"

Consider these aspects:
1. Platform-specific best practices for ${platform}
2. Emotional triggers and psychological principles
3. Clear call-to-action
4. Character limits and format requirements

Generate variations that maintain the core message but test different:
- Headlines
- Value propositions
- Call-to-action phrases
- Emotional appeals

Format: Return only the ad copy variations, one per line.`;

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
          content: prompt 
        }],
        system: "You are an expert ad copywriter specializing in social media advertising."
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${await response.text()}`);
    }

    const data = await response.json();
    const variations = data.content[0].text.split('\n').filter(Boolean);
    
    return new Response(
      JSON.stringify({ variations: variations.slice(0, 3) }), // Limit to 3 variations
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error generating ad variations:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});