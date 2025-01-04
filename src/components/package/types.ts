export interface Package {
  name: string;
  version: string;
  description?: string;
}

export interface PackageVersion {
  id: string;
  version: string;
  changes?: string;
  package_data: any;
  created_at: string;
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
}

export type AccessLevel = "read" | "write" | "admin";

export interface PackageAccess {
  id: string;
  package_id: string;
  user_id: string;
  access_level: AccessLevel;
}

export interface TeamAccess {
  id: string;
  team_id: string;
  package_id: string;
  access_level: AccessLevel;
}

export interface AccessRequest {
  id: string;
  user_id: string;
  package_id: string;
  requested_level: AccessLevel;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface ReleaseNote {
  version: string;
  title: string;
  description: string;
  changes: string[];
  breaking_changes: string[];
  created_at: string;
}