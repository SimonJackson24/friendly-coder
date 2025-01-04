import { Json } from './database';

export interface DependencyResolutionsTable {
  Row: {
    id: string;
    package_name: string;
    resolution_strategy: string;
    resolved_version: string | null;
    resolution_date: string | null;
    risk_level: string | null;
    created_at: string | null;
    updated_at: string | null;
  }
  Insert: {
    id?: string;
    package_name: string;
    resolution_strategy: string;
    resolved_version?: string | null;
    resolution_date?: string | null;
    risk_level?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
  }
  Update: {
    id?: string;
    package_name?: string;
    resolution_strategy?: string;
    resolved_version?: string | null;
    resolution_date?: string | null;
    risk_level?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
  }
}