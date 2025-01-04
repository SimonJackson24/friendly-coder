import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { executeCommand, runTests, runBuild } from './command-runner.ts';
import { deployToVercel, deployToNetlify } from './deployment.ts';
import { uploadArtifact } from './artifacts.ts';
import { BuildContext } from './types.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { buildId, projectId, environment, config } = await req.json() as BuildContext;
    console.log('Build request received:', { buildId, projectId, environment });

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const context: BuildContext = { buildId, projectId, environment, config };

    // Get next build number
    const { data: buildNumberData } = await supabase.rpc(
      'get_next_build_number',
      { p_project_id: projectId }
    );

    // Create build record
    await supabase
      .from('builds')
      .insert({
        id: buildId,
        project_id: projectId,
        status: 'running',
        build_number: buildNumberData,
        environment,
        build_config: config,
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    // Execute build steps
    for (const step of config.steps) {
      console.log('Executing step:', step.name);
      
      // Create step record
      await supabase
        .from('build_steps')
        .insert({
          build_id: buildId,
          step_name: step.name,
          step_type: step.type,
          status: 'running',
          started_at: new Date().toISOString(),
          step_config: step
        });

      try {
        let result;
        
        switch (step.type) {
          case 'install':
            result = await executeCommand('npm install', context);
            break;
          case 'test':
            result = await runTests(context, step.framework || 'jest');
            break;
          case 'build':
            result = await runBuild(context);
            if (result.success) {
              // Upload build artifacts
              await uploadArtifact(context, 'dist.zip', new Uint8Array());
            }
            break;
          case 'deploy':
            result = step.platform === 'vercel' 
              ? await deployToVercel(context)
              : await deployToNetlify(context);
            break;
        }

        if (!result.success) {
          throw new Error(`Step ${step.name} failed: ${result.output || 'Unknown error'}`);
        }

        // Update step status to completed
        await supabase
          .from('build_steps')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString()
          })
          .eq('build_id', buildId)
          .eq('step_name', step.name);

      } catch (error) {
        console.error('Step execution error:', error);
        
        // Update step status to failed
        await supabase
          .from('build_steps')
          .update({
            status: 'failed',
            completed_at: new Date().toISOString(),
            error_message: error.message
          })
          .eq('build_id', buildId)
          .eq('step_name', step.name);

        // Update build status to failed
        await supabase
          .from('builds')
          .update({ 
            status: 'failed',
            completed_at: new Date().toISOString(),
            error_message: error.message
          })
          .eq('id', buildId);

        throw error;
      }
    }

    // Update build status to completed
    await supabase
      .from('builds')
      .update({ 
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', buildId);

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Build execution error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});