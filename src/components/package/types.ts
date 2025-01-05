import { Json } from "@/integrations/supabase/types";

export interface Package {
  id: string;
  name: string;
  version: string;
  description: string;
  is_private: boolean;
  author_id: string;
  package_data: Record<string, any>;
  download_count: number;
  created_at: string;
  updated_at: string;
}

export interface PublishStep {
  id: string;
  name: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
  message?: string;
  error?: string;
}

export interface DependencyCheck {
  name: string;
  version: string;
  compatible: boolean;
  conflicts: string[];
  suggestedVersion?: string;
  message?: string;
  requiredBy?: string[];
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface PublishValidation {
  valid: boolean;
  errors: string[];
  warnings: string[];
  dependencyChecks: DependencyCheck[];
  breakingChanges: string[];
  dependencies: DependencyCheck[];
  publishSteps: PublishStep[];
}

export interface PackageAccess {
  id: string;
  package_id: string;
  user_id: string;
  access_level: AccessLevel;
  created_at: string;
  updated_at: string;
}

export type AccessLevel = 'read' | 'write' | 'admin';

export interface TeamAccess {
  id: string;
  team_id: string;
  package_id: string;
  access_level: AccessLevel;
  created_at: string;
  updated_at: string;
}

export interface AccessRequest {
  id: string;
  user_id: string;
  package_id: string;
  requested_level: AccessLevel;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  filters: Record<string, any>;
  created_at: string;
}

export interface ReleaseNote {
  id: string;
  package_id: string;
  version: string;
  title: string;
  description: string;
  changes: string[];
  breaking_changes: string[];
  changelog_type: 'feature' | 'bugfix' | 'breaking' | 'maintenance';
  impact_level: 'minor' | 'major' | 'patch';
  affected_components: string[];
  migration_steps: Record<string, any>;
  created_at: string;
}

export interface PackageVersion {
  id: string;
  package_id: string;
  version: string;
  changes: string;
  package_data: Record<string, any>;
  published_by: string;
  created_at: string;
  dependency_tree: Record<string, any>;
  resolved_dependencies: Record<string, any>;
  conflict_status: Record<string, any>;
}

export interface PermissionTemplate {
  id: string;
  name: string;
  description: string;
  permissions: Record<string, any>;
  created_by: string;
  created_at: string;
  updated_at: string;
}

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

export interface ChangeCategory {
  id: string;
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  requires_approval: boolean;
}

export interface PermissionHierarchy {
  id: string;
  name: string;
  level: number;
  parent_id?: string;
  permissions: Record<string, AccessLevel>;
  description: string;
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

export interface BulkPermissionOperation {
  userIds: string[];
  accessLevel: AccessLevel;
  template?: PermissionTemplate;
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
