import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { handleGithubOperations } from './handlers/github-handler.ts';
import { handleDependencyOperations } from './handlers/dependency-handler.ts';
import { handleDeploymentOperations } from './handlers/deployment-handler.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

console.log("Loading project operations handler...");

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { operation, data } = await req.json();
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`Processing ${operation} operation with data:`, data);

    let result;
    if (operation.startsWith('github-')) {
      result = await handleGithubOperations(operation, data, supabase);
    } else if (operation === 'analyze-dependencies') {
      result = await handleDependencyOperations(operation, data);
    } else if (operation === 'deploy') {
      result = await handleDeploymentOperations(operation, data);
    } else {
      throw new Error(`Unknown operation: ${operation}`);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error in project operations:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});