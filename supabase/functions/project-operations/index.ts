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
    const { operation, projectId, data } = await req.json();
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`Processing ${operation} operation for project ${projectId}`);

    switch (operation) {
      case 'github-import':
        const { repoUrl, projectName } = data;
        console.log('Importing GitHub repository:', repoUrl);
        
        // Extract owner and repo from GitHub URL
        const urlParts = repoUrl.replace(/\.git$/, '').split('/');
        const owner = urlParts[urlParts.length - 2];
        const repo = urlParts[urlParts.length - 1];
        
        // Fetch repository contents
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents`);
        if (!response.ok) {
          throw new Error('Failed to fetch repository contents');
        }
        
        const contents = await response.json();
        const files = [];
        
        // Process each file in the repository
        for (const item of contents) {
          if (item.type === 'file') {
            const fileResponse = await fetch(item.download_url);
            const content = await fileResponse.text();
            files.push({
              name: item.name,
              path: item.path,
              content,
              type: 'file'
            });
          }
        }
        
        return new Response(JSON.stringify({ files }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'analyze-dependencies':
        // Analyze package.json and provide recommendations
        const { packageData } = data;
        const analysis = await analyzeDependencies(packageData);
        return new Response(JSON.stringify(analysis), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'deploy':
        // Handle deployment to various platforms
        const { platform, config } = data;
        const deploymentResult = await handleDeployment(platform, config, projectId);
        return new Response(JSON.stringify(deploymentResult), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'github-export':
        // Handle GitHub repository creation and code push
        const { repoName, isPrivate } = data;
        const githubToken = Deno.env.get('GITHUB_ACCESS_TOKEN');
        if (!githubToken) {
          throw new Error('GitHub token not configured');
        }
        const exportResult = await exportToGithub(repoName, isPrivate, githubToken, projectId);
        return new Response(JSON.stringify(exportResult), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

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

async function analyzeDependencies(packageData: any) {
  // Implement dependency analysis logic
  const dependencies = Object.entries(packageData.dependencies || {});
  const devDependencies = Object.entries(packageData.devDependencies || {});
  
  return {
    totalDependencies: dependencies.length + devDependencies.length,
    recommendations: [],
    securityIssues: [],
    outdatedPackages: []
  };
}

async function handleDeployment(platform: string, config: any, projectId: string) {
  // Implement deployment logic for different platforms
  switch (platform) {
    case 'vercel':
      // Implement Vercel deployment
      return { status: 'pending', platform, url: null };
    case 'netlify':
      // Implement Netlify deployment
      return { status: 'pending', platform, url: null };
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}

async function exportToGithub(repoName: string, isPrivate: boolean, token: string, projectId: string) {
  // Implement GitHub repository creation and code push
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  };

  // Create repository
  const createRepoResponse = await fetch('https://api.github.com/user/repos', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      name: repoName,
      private: isPrivate,
      auto_init: true,
    }),
  });

  if (!createRepoResponse.ok) {
    throw new Error('Failed to create GitHub repository');
  }

  return {
    status: 'success',
    repository: await createRepoResponse.json(),
  };
}
