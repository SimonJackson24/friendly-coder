export interface DeploymentConfig {
  platform: string;
  domain?: string;
  environment?: 'production' | 'staging' | 'development';
  settings?: Record<string, unknown>;
}

export interface DeploymentHistoryRecord {
  id: string;
  project_id: string;
  deployment_config: DeploymentConfig;
  status: string;
  started_at: string;
  completed_at?: string;
  logs: any[];
  error_message?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}