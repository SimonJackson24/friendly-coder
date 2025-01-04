import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { importFromGithub, exportToGithub } from '../github.ts';

export async function handleGithubOperations(operation: string, data: any, supabase: any) {
  const githubToken = Deno.env.get('GITHUB_ACCESS_TOKEN');
  if (!githubToken) {
    throw new Error('GitHub token not configured');
  }

  switch (operation) {
    case 'github-import': {
      const { repoUrl, projectId } = data;
      return await importFromGithub(repoUrl, projectId, githubToken, supabase);
    }
    case 'github-export': {
      const { repoName, isPrivate } = data;
      return await exportToGithub(repoName, isPrivate, githubToken);
    }
    default:
      throw new Error(`Unknown GitHub operation: ${operation}`);
  }
}