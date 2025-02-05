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
  buildId: string;
  projectId: string;
  environment: string;
  config: BuildConfig;
}

export interface BuildResult {
  success: boolean;
  logs: string[];
  error?: string;
  artifacts?: string[];
}