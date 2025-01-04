import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { BuildContext } from './types.ts';

export async function uploadArtifact(
  context: BuildContext,
  filePath: string,
  content: Uint8Array
): Promise<{ success: boolean; url?: string }> {
  console.log('Uploading artifact:', { filePath, context });
  
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const artifactPath = `${context.buildId}/${filePath}`;
    
    const { data, error } = await supabase.storage
      .from('build_artifacts')
      .upload(artifactPath, content, {
        contentType: 'application/octet-stream',
        upsert: true,
      });

    if (error) {
      throw error;
    }

    // Update build record with artifact URL
    const { error: updateError } = await supabase
      .from('builds')
      .update({
        artifacts_urls: supabase.storage
          .from('build_artifacts')
          .getPublicUrl(artifactPath).data.publicUrl,
      })
      .eq('id', context.buildId);

    if (updateError) {
      throw updateError;
    }

    return { success: true, url: data.path };
  } catch (error) {
    console.error('Artifact upload error:', error);
    return { success: false };
  }
}

export async function downloadArtifact(
  context: BuildContext,
  artifactPath: string
): Promise<{ success: boolean; content?: Uint8Array }> {
  console.log('Downloading artifact:', { artifactPath, context });
  
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data, error } = await supabase.storage
      .from('build_artifacts')
      .download(artifactPath);

    if (error) {
      throw error;
    }

    return { success: true, content: new Uint8Array(await data.arrayBuffer()) };
  } catch (error) {
    console.error('Artifact download error:', error);
    return { success: false };
  }
}