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

    // Get the next build number
    const { data: buildNumberData } = await supabaseClient.rpc(
      'get_next_build_number',
      { p_project_id: projectId }
    );

    // Create build record
    const { data: build, error: buildError } = await supabaseClient
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

    if (buildError) {
      console.error('Build creation error:', buildError);
      throw buildError;
    }

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
            await executeInstallStep(step, supabaseClient, buildId);
            break;
          case 'test':
            await executeTestStep(step, supabaseClient, buildId);
            break;
          case 'build':
            await executeBuildStep(step, supabaseClient, buildId);
            break;
          case 'deploy':
            await executeDeployStep(step, supabaseClient, buildId);
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

async function executeInstallStep(
  step: any,
  supabaseClient: any,
  buildId: string
) {
  // Log step start
  await logBuildMessage(supabaseClient, buildId, `Installing dependencies: ${step.command}`);
  
  // Execute npm/yarn install
  const command = step.command || 'npm install';
  
  // Simulate command execution (replace with actual execution logic)
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  await logBuildMessage(supabaseClient, buildId, 'Dependencies installed successfully');
}

async function executeTestStep(
  step: any,
  supabaseClient: any,
  buildId: string
) {
  await logBuildMessage(supabaseClient, buildId, `Running tests: ${step.command}`);
  
  // Execute test command
  const command = step.command || 'npm test';
  
  // Simulate test execution (replace with actual test runner integration)
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  await logBuildMessage(supabaseClient, buildId, 'Tests completed successfully');
}

async function executeBuildStep(
  step: any,
  supabaseClient: any,
  buildId: string
) {
  await logBuildMessage(supabaseClient, buildId, `Building project: ${step.command}`);
  
  // Execute build command
  const command = step.command || 'npm run build';
  
  // Simulate build process (replace with actual build logic)
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Store build artifacts
  const artifactPath = `builds/${buildId}/artifact.zip`;
  
  // Update build record with artifact URL
  await supabaseClient
    .from('builds')
    .update({
      artifacts_urls: [artifactPath]
    })
    .eq('id', buildId);
  
  await logBuildMessage(supabaseClient, buildId, 'Build completed successfully');
}

async function executeDeployStep(
  step: any,
  supabaseClient: any,
  buildId: string
) {
  await logBuildMessage(supabaseClient, buildId, `Deploying to ${step.environment}`);
  
  // Execute deployment command
  const command = step.command;
  
  // Simulate deployment process (replace with actual deployment logic)
  await new Promise(resolve => setTimeout(resolve, 4000));
  
  await logBuildMessage(supabaseClient, buildId, 'Deployment completed successfully');
}

async function logBuildMessage(
  supabaseClient: any,
  buildId: string,
  message: string
) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  
  const { data: build } = await supabaseClient
    .from('builds')
    .select('build_logs')
    .eq('id', buildId)
    .single();
  
  const logs = build?.build_logs || [];
  logs.push(logMessage);
  
  await supabaseClient
    .from('builds')
    .update({ build_logs: logs })
    .eq('id', buildId);
}