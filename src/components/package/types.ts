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

export interface PackageAccess {
  id: string;
  package_id: string;
  user_id: string;
  access_level: 'read' | 'write' | 'admin';
}