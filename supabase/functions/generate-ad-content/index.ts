import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

console.log("Loading ad content generator...");

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { businessName, productDescription, targetAudience, platform, goals, tone } = await req.json();

    const platformGuidelines = {
      facebook: "Create an engaging social media ad that's visually descriptive, includes a clear call-to-action, and follows the 20% text rule for images.",
      instagram: "Design a visually-focused ad that resonates with Instagram's aesthetic, includes relevant hashtags, and emphasizes lifestyle imagery.",
      twitter: "Write a concise, punchy ad that works well with Twitter's fast-paced environment and includes relevant hashtags.",
      google: "Develop a keyword-rich ad that focuses on search intent and includes relevant call-to-actions and extensions.",
      linkedin: "Create a professional, business-focused ad that emphasizes value proposition and industry expertise."
    };

    const prompt = `Create a high-converting ${platform} ad for the following business:
    
Business Name: ${businessName}
Product/Service: ${productDescription}
Target Audience: ${targetAudience}
Campaign Goals: ${goals}
Tone: ${tone}

Platform-Specific Guidelines: ${platformGuidelines[platform] || "Create a compelling ad that follows the platform's best practices."}

Please generate comprehensive ad copy that includes:
1. Primary Headline (attention-grabbing, includes keywords)
2. Secondary Headlines/Descriptions
3. Main Ad Copy (optimized for the platform)
4. Call-to-Action
5. Relevant Hashtags or Keywords
6. Image/Video Recommendations
7. Targeting Recommendations
8. Compliance Checklist

Format the response in a clear, structured way with sections clearly labeled.`;

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
        system: "You are an expert ad copywriter with deep knowledge of digital advertising best practices across all major platforms."
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${await response.text()}`);
    }

    const data = await response.json();
    
    return new Response(
      JSON.stringify({ content: data.content[0].text }),
      { 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        } 
      }
    );

  } catch (error) {
    console.error("Error in Edge Function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        } 
      }
    );
  }
});