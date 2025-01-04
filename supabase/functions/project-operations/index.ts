import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { importFromGithub, exportToGithub } from './github.ts';
import { analyzeDependencies } from './dependencies.ts';
import { handleDeployment } from './deployment.ts';

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

    switch (operation) {
      case 'github-import': {
        const { repoUrl, projectId } = data;
        const githubToken = Deno.env.get('GITHUB_ACCESS_TOKEN');
        if (!githubToken) {
          throw new Error('GitHub token not configured');
        }
        const result = await importFromGithub(repoUrl, projectId, githubToken, supabase);
        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'analyze-dependencies': {
        const analysis = await analyzeDependencies(data);
        return new Response(JSON.stringify(analysis), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'deploy': {
        const { platform, config } = data;
        const result = await handleDeployment(platform, config);
        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'github-export': {
        const { repoName, isPrivate } = data;
        const githubToken = Deno.env.get('GITHUB_ACCESS_TOKEN');
        if (!githubToken) {
          throw new Error('GitHub token not configured');
        }
        const result = await exportToGithub(repoName, isPrivate, githubToken);
        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
  } catch (error) {
    console.error("Error in project operations:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});