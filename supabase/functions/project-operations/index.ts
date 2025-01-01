import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

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
    const githubToken = Deno.env.get('GITHUB_ACCESS_TOKEN');
    
    if (!githubToken) {
      throw new Error('GitHub token not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`Processing ${operation} operation with data:`, data);

    switch (operation) {
      case 'github-export':
        return await handleGitHubExport(data, githubToken);
      
      case 'github-import':
        return await handleGitHubImport(data, githubToken);
      
      case 'github-create-pr':
        return await handleCreatePR(data, githubToken);
      
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
  } catch (error) {
    console.error("Error in project operations:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function handleGitHubExport(data: any, token: string) {
  const { repoName, isPrivate, licenseType } = data;

  // Create repository
  const createRepoResponse = await fetch('https://api.github.com/user/repos', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: repoName,
      private: isPrivate,
      auto_init: true,
      license_template: licenseType === 'none' ? null : licenseType,
    }),
  });

  if (!createRepoResponse.ok) {
    throw new Error('Failed to create GitHub repository');
  }

  return new Response(
    JSON.stringify({
      status: 'success',
      repository: await createRepoResponse.json(),
    }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
}

async function handleGitHubImport(data: any, token: string) {
  const { repoUrl } = data;

  // Extract owner and repo from URL
  const urlParts = repoUrl.split('/');
  const owner = urlParts[urlParts.length - 2];
  const repo = urlParts[urlParts.length - 1];

  // Get repository information
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch repository information');
  }

  return new Response(
    JSON.stringify({
      status: 'success',
      repository: await response.json(),
    }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
}

async function handleCreatePR(data: any, token: string) {
  const { repo, branch } = data;

  // Extract owner and repo name from repo URL
  const urlParts = repo.split('/');
  const owner = urlParts[urlParts.length - 2];
  const repoName = urlParts[urlParts.length - 1];

  // Create pull request
  const response = await fetch(`https://api.github.com/repos/${owner}/${repoName}/pulls`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: `Changes from ${branch}`,
      head: branch,
      base: 'main',
      body: 'Please review these changes',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create pull request');
  }

  return new Response(
    JSON.stringify({
      status: 'success',
      pullRequest: await response.json(),
    }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
}