import { supabase } from "@/integrations/supabase/client";
import Logger from "@/utils/logger";
import { BuildContext, BuildResult, BuildStep } from "./types";

export class BuildExecutor {
  private context: BuildContext;
  private logs: string[] = [];

  constructor(context: BuildContext) {
    this.context = context;
  }

  private async logBuildMessage(message: string) {
    this.logs.push(message);
    Logger.log('build', message, { buildId: this.context.buildId });
    
    await supabase
      .from('builds')
      .update({ 
        build_logs: this.logs,
        updated_at: new Date().toISOString()
      })
      .eq('id', this.context.buildId);
  }

  private async updateBuildStatus(status: string, errorMessage?: string) {
    await supabase
      .from('builds')
      .update({ 
        status,
        error_message: errorMessage,
        updated_at: new Date().toISOString()
      })
      .eq('id', this.context.buildId);
  }

  private async executeStep(step: BuildStep): Promise<boolean> {
    try {
      await this.logBuildMessage(`Starting step: ${step.name}`);
      
      await supabase
        .from('build_steps')
        .insert({
          build_id: this.context.buildId,
          step_name: step.name,
          step_type: step.type,
          status: 'running',
          started_at: new Date().toISOString(),
          step_config: step
        });

      // Execute the step based on its type
      switch (step.type) {
        case 'install':
          await this.executeInstallStep(step);
          break;
        case 'test':
          await this.executeTestStep(step);
          break;
        case 'build':
          await this.executeBuildStep(step);
          break;
        case 'deploy':
          await this.executeDeployStep(step);
          break;
      }

      await this.logBuildMessage(`Completed step: ${step.name}`);
      
      await supabase
        .from('build_steps')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('build_id', this.context.buildId)
        .eq('step_name', step.name);

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await this.logBuildMessage(`Error in step ${step.name}: ${errorMessage}`);
      
      await supabase
        .from('build_steps')
        .update({
          status: 'failed',
          completed_at: new Date().toISOString(),
          error_message: errorMessage
        })
        .eq('build_id', this.context.buildId)
        .eq('step_name', step.name);

      return false;
    }
  }

  private async executeInstallStep(step: BuildStep) {
    await this.logBuildMessage(`Installing dependencies...`);
    // Implementation will be added in the next iteration
  }

  private async executeTestStep(step: BuildStep) {
    await this.logBuildMessage(`Running tests...`);
    // Implementation will be added in the next iteration
  }

  private async executeBuildStep(step: BuildStep) {
    await this.logBuildMessage(`Building project...`);
    // Implementation will be added in the next iteration
  }

  private async executeDeployStep(step: BuildStep) {
    await this.logBuildMessage(`Deploying to ${this.context.environment}...`);
    // Implementation will be added in the next iteration
  }

  async execute(): Promise<BuildResult> {
    try {
      await this.updateBuildStatus('running');
      await this.logBuildMessage('Starting build pipeline');

      for (const step of this.context.config.steps) {
        const success = await this.executeStep(step);
        if (!success) {
          await this.updateBuildStatus('failed');
          return {
            success: false,
            logs: this.logs,
            error: `Failed at step: ${step.name}`
          };
        }
      }

      await this.updateBuildStatus('completed');
      return {
        success: true,
        logs: this.logs
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await this.updateBuildStatus('failed', errorMessage);
      return {
        success: false,
        logs: this.logs,
        error: errorMessage
      };
    }
  }
}