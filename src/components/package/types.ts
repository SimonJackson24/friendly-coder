export interface Package {
  id: string;
  name: string;
  version: string;
  description: string;
  is_private: boolean;
  author_id: string;
  package_data: any;
}

export interface PackageValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  dependencies: DependencyCheck[];
}

export interface DependencyCheck {
  name: string;
  version: string;
  isCompatible: boolean;
  conflicts: string[];
  requiredBy: string[];
  suggestedVersion?: string;
}

export interface PublishStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
  error?: string;
}

export interface PublishValidation extends PackageValidation {
  dependencyChecks: DependencyCheck[];
  breakingChanges: string[];
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
  user_id: string;
  query: string;
  filters: {
    category?: string;
    tags?: string[];
  };
  created_at: string;
}

export interface PackageVersion {
  id: string;
  package_id: string;
  version: string;
  changes: string | null;
  package_data: any;
  published_by: string;
  created_at: string;
}

export interface ReleaseNote {
  id: string;
  package_id: string;
  version: string;
  title: string;
  description: string | null;
  changes: string[];
  breaking_changes: string[];
  created_at: string;
}