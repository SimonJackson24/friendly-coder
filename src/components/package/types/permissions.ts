import { AccessLevel } from './common';

export interface PermissionTemplate {
  id: string;
  name: string;
  description: string;
  permissions: Record<string, any>;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface PermissionHierarchy {
  id: string;
  name: string;
  level: number;
  parent_id?: string;
  permissions: Record<string, AccessLevel>;
  description: string;
}

export interface BulkPermissionOperation {
  userIds: string[];
  accessLevel: AccessLevel;
  template?: PermissionTemplate;
}