import { AccessLevel } from './common';

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

export interface PackageAccess {
  id: string;
  package_id: string;
  user_id: string;
  access_level: AccessLevel;
  created_at: string;
  updated_at: string;
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