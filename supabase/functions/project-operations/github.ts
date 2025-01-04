import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

export async function importFromGithub(repoUrl: string, projectId: string, token: string, supabase: any) {
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

export async function exportToGithub(repoName: string, isPrivate: boolean, token: string) {
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