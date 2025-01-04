import { BuildContext } from './types.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

export async function deployToVercel(context: BuildContext): Promise<{ success: boolean; url?: string }> {
  console.log('Deploying to Vercel:', context);
  
  try {
    // Use Vercel API to create deployment
    const response = await fetch('https://api.vercel.com/v12/deployments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('VERCEL_TOKEN')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: context.projectId,
        files: [], // Add deployment files
        projectSettings: {
          framework: null,
        },
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Deployment failed');
    }

    return { success: true, url: data.url };
  } catch (error) {
    console.error('Vercel deployment error:', error);
    return { success: false };
  }
}

export async function deployToNetlify(context: BuildContext): Promise<{ success: boolean; url?: string }> {
  console.log('Deploying to Netlify:', context);
  
  try {
    // Use Netlify API to create deployment
    const response = await fetch('https://api.netlify.com/api/v1/sites', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('NETLIFY_TOKEN')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: context.projectId,
        // Add deployment configuration
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Deployment failed');
    }

    return { success: true, url: data.url };
  } catch (error) {
    console.error('Netlify deployment error:', error);
    return { success: false };
  }
}