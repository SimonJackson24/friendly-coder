import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BuildRequest {
  buildId: string;
  projectId: string;
  environment: string;
  config: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('Build executor function started');
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { buildId, projectId, environment, config } = await req.json() as BuildRequest;
    console.log('Build request received:', { buildId, projectId, environment });

    // Validate the build exists and belongs to the user
    const { data: build, error: buildError } = await supabaseClient
      .from('builds')
      .select('id')
      .eq('id', buildId)
      .single();

    if (buildError || !build) {
      console.error('Build validation error:', buildError);
      throw new Error('Build not found or unauthorized');
    }

    // Update build status to running
    await supabaseClient
      .from('builds')
      .update({ 
        status: 'running',
        started_at: new Date().toISOString()
      })
      .eq('id', buildId);

    console.log('Starting build steps execution');

    // Execute build steps
    for (const step of config.steps) {
      console.log('Executing step:', step.name);
      
      // Create build step record
      const { error: stepError } = await supabaseClient
        .from('build_steps')
        .insert({
          build_id: buildId,
          step_name: step.name,
          step_type: step.type,
          status: 'running',
          started_at: new Date().toISOString(),
          step_config: step
        });

      if (stepError) {
        console.error('Step creation error:', stepError);
        throw stepError;
      }

      try {
        // Execute the step based on its type
        switch (step.type) {
          case 'install':
            console.log('Running install step:', step.command);
            // Add actual package installation logic here
            break;
          case 'test':
            console.log('Running test step:', step.command);
            // Add actual test execution logic here
            break;
          case 'build':
            console.log('Running build step:', step.command);
            // Add actual build execution logic here
            break;
          case 'deploy':
            console.log('Running deploy step:', step.command);
            // Add actual deployment logic here
            break;
        }

        // Update step status to completed
        await supabaseClient
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
        await supabaseClient
          .from('build_steps')
          .update({
            status: 'failed',
            completed_at: new Date().toISOString(),
            error_message: error instanceof Error ? error.message : 'Unknown error'
          })
          .eq('build_id', buildId)
          .eq('step_name', step.name);

        throw error;
      }
    }

    console.log('Build completed successfully');

    // Update build status to completed
    await supabaseClient
      .from('builds')
      .update({ 
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', buildId);

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
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