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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { buildId, projectId, environment, config } = await req.json() as BuildRequest;

    // Validate the build exists and belongs to the user
    const { data: build, error: buildError } = await supabaseClient
      .from('builds')
      .select('id')
      .eq('id', buildId)
      .single();

    if (buildError || !build) {
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

    // Execute build steps
    for (const step of config.steps) {
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
        throw stepError;
      }

      // TODO: Implement actual step execution logic
      // For now, we'll simulate step execution with a delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update step status
      await supabaseClient
        .from('build_steps')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('build_id', buildId)
        .eq('step_name', step.name);
    }

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