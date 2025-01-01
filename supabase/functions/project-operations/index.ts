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
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`Processing ${operation} operation with data:`, data);

    switch (operation) {
      case 'github-import':
        const { repoUrl, projectId } = data;
        const githubToken = Deno.env.get('GITHUB_ACCESS_TOKEN');
        if (!githubToken) {
          throw new Error('GitHub token not configured');
        }
        const importResult = await importFromGithub(repoUrl, projectId, githubToken, supabase);
        return new Response(JSON.stringify(importResult), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'analyze-dependencies':
        console.log('Analyzing dependencies:', data);
        const analysis = await analyzeDependencies(data);
        return new Response(JSON.stringify(analysis), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'deploy':
        const { platform, config } = data;
        const deploymentResult = await handleDeployment(platform, config);
        return new Response(JSON.stringify(deploymentResult), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'github-export':
        const { repoName, isPrivate } = data;
        const githubTokenExport = Deno.env.get('GITHUB_ACCESS_TOKEN');
        if (!githubTokenExport) {
          throw new Error('GitHub token not configured');
        }
        const exportResult = await exportToGithub(repoName, isPrivate, githubTokenExport);
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

async function importFromGithub(repoUrl: string, projectId: string, token: string, supabase: any) {
  console.log('Starting GitHub import:', { repoUrl, projectId });

  const urlParts = repoUrl.split('/');
  const owner = urlParts[urlParts.length - 2];
  const repo = urlParts[urlParts.length - 1];

  try {
    await supabase
      .from('projects')
      .update({ 
        github_import_status: 'importing',
        github_url: repoUrl 
      })
      .eq('id', projectId);

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    };

    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents`, {
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch repository contents');
    }

    const contents = await response.json();
    console.log('Fetched repository contents:', contents);

    for (const item of contents) {
      if (item.type === 'file') {
        const fileContent = await fetch(item.download_url).then(res => res.text());
        
        await supabase
          .from('files')
          .insert({
            project_id: projectId,
            name: item.name,
            path: item.path,
            content: fileContent,
            type: 'file'
          });
      }
    }

    await supabase
      .from('projects')
      .update({ 
        github_import_status: 'completed',
        github_branch: 'main',
        github_commit_sha: contents[0]?.sha || null
      })
      .eq('id', projectId);

    console.log('GitHub import completed successfully');
    
    return {
      status: 'success',
      projectId,
      repository: {
        owner,
        repo,
        url: repoUrl,
      },
    };
  } catch (error) {
    console.error('Error during GitHub import:', error);
    
    await supabase
      .from('projects')
      .update({ 
        github_import_status: 'error',
        github_import_error: error.message
      })
      .eq('id', projectId);
    
    throw error;
  }
}

async function analyzeDependencies(data: any) {
  try {
    console.log('Received package data:', data);
    
    const packageData = data?.packageData || {};
    const dependencies = Object.entries(packageData.dependencies || {});
    const devDependencies = Object.entries(packageData.devDependencies || {});
    
    console.log('Processing dependencies:', {
      dependencies: dependencies.length,
      devDependencies: devDependencies.length
    });

    return {
      totalDependencies: dependencies.length + devDependencies.length,
      recommendations: [],
      securityIssues: [],
      outdatedPackages: []
    };
  } catch (error) {
    console.error('Error analyzing dependencies:', error);
    throw error;
  }
}

async function handleDeployment(platform: string, config: any) {
  switch (platform) {
    case 'vercel':
      return { status: 'pending', platform, url: null };
    case 'netlify':
      return { status: 'pending', platform, url: null };
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}

async function exportToGithub(repoName: string, isPrivate: boolean, token: string) {
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  };

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
