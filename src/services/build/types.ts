export type BuildStepType = 'install' | 'test' | 'build' | 'deploy';

export interface BuildStep {
  name: string;
  type: BuildStepType;
  command: string;
  environment?: Record<string, string>;
}

export interface BuildConfig {
  steps: BuildStep[];
  environment?: Record<string, string>;
  triggers?: {
    branches?: string[];
    events?: ('push' | 'pull_request')[];
  };
}

export interface BuildContext {
  projectId: string;
  buildId: string;
  environment: string;
  config: BuildConfig;
}

export interface BuildResult {
  success: boolean;
  logs: string[];
  error?: string;
  artifacts?: string[];
}

export interface BuildStepRecord {
  build_id: string;
  step_name: string;
  step_type: string;
  status: string;
  started_at?: string;
  completed_at?: string;
  step_logs?: string[];
  error_message?: string;
  step_config: Record<string, any>;
}