export interface RollbackAnalysis {
  id: string;
  package_id: string;
  version_from: string;
  version_to: string;
  impact_analysis: {
    breaking_changes: string[];
    affected_dependencies: string[];
    risk_level: 'low' | 'medium' | 'high';
  };
  created_at: string;
  updated_at: string;
}

export interface RollbackValidation {
  valid: boolean;
  breaking_changes: string[];
  affected_services: string[];
  required_actions: string[];
  estimated_downtime: number;
  risk_level: 'low' | 'medium' | 'high';
  validation_steps: {
    id: string;
    name: string;
    status: 'pending' | 'passed' | 'failed';
    message?: string;
  }[];
  impactAnalysis: ImpactAnalysisVisualization;
}

export interface ImpactAnalysisVisualization {
  affectedServices: string[];
  riskLevel: 'low' | 'medium' | 'high';
  breakingChanges: string[];
  estimatedDowntime: number;
  dependencyImpact: {
    name: string;
    impact: 'none' | 'minor' | 'major';
    details: string;
  }[];
}