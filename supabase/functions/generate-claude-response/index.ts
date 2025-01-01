import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

console.log("Loading Claude response generator...");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();
    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');

    if (!anthropicApiKey) {
      console.error("Missing Anthropic API key");
      throw new Error("Anthropic API key not configured");
    }

    console.log("Processing request with prompt:", prompt);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: "claude-3-opus-20240229",
        max_tokens: 1024,
        messages: [{ 
          role: "user", 
          content: prompt 
        }],
      }),
    });

    if (!response.ok) {
      console.error("Anthropic API error:", await response.text());
      throw new Error("Failed to get response from Anthropic API");
    }

    const data = await response.json();
    console.log("Generated response successfully");

    if (!data.content || !data.content[0] || !data.content[0].text) {
      throw new Error("Invalid response format from Anthropic API");
    }

    return new Response(
      JSON.stringify({ response: data.content[0].text }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in generate-claude-response:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Failed to generate response",
        details: error
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});