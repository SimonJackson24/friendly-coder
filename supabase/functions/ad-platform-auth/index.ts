import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

console.log("Loading ad platform auth handler...");

async function exchangeFacebookToken(code: string, redirectUri: string) {
  console.log("Exchanging Facebook token...");
  const clientId = Deno.env.get('FACEBOOK_CLIENT_ID');
  const clientSecret = Deno.env.get('FACEBOOK_CLIENT_SECRET');
  
  const response = await fetch(
    `https://graph.facebook.com/v18.0/oauth/access_token?` +
    `client_id=${clientId}&` +
    `client_secret=${clientSecret}&` +
    `code=${code}&` +
    `redirect_uri=${redirectUri}`
  );

  if (!response.ok) {
    throw new Error(`Facebook token exchange failed: ${await response.text()}`);
  }

  return await response.json();
}

async function exchangeGoogleToken(code: string, redirectUri: string) {
  console.log("Exchanging Google token...");
  const clientId = Deno.env.get('GOOGLE_CLIENT_ID');
  const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET');
  
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code,
      client_id: clientId!,
      client_secret: clientSecret!,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });

  if (!response.ok) {
    throw new Error(`Google token exchange failed: ${await response.text()}`);
  }

  return await response.json();
}

async function exchangeLinkedInToken(code: string, redirectUri: string) {
  console.log("Exchanging LinkedIn token...");
  const clientId = Deno.env.get('LINKEDIN_CLIENT_ID');
  const clientSecret = Deno.env.get('LINKEDIN_CLIENT_SECRET');
  
  const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: clientId!,
      client_secret: clientSecret!,
      redirect_uri: redirectUri,
    }),
  });

  if (!response.ok) {
    throw new Error(`LinkedIn token exchange failed: ${await response.text()}`);
  }

  return await response.json();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { platform, code, redirectUri, userId } = await req.json();
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`Processing OAuth for platform: ${platform}, userId: ${userId}`);

    let tokenResponse;
    switch (platform) {
      case 'facebook':
        tokenResponse = await exchangeFacebookToken(code, redirectUri);
        break;
      case 'google':
        tokenResponse = await exchangeGoogleToken(code, redirectUri);
        break;
      case 'linkedin':
        tokenResponse = await exchangeLinkedInToken(code, redirectUri);
        break;
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }

    // Store the connection in Supabase
    const { error } = await supabase
      .from('ad_platform_connections')
      .upsert({
        user_id: userId,
        platform,
        access_token: tokenResponse.access_token,
        refresh_token: tokenResponse.refresh_token,
        expires_at: new Date(Date.now() + (tokenResponse.expires_in * 1000)).toISOString(),
        platform_settings: tokenResponse.additional_data || {},
      });

    if (error) throw error;

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error in ad platform auth:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});