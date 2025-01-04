import { Json } from './database';

export interface WorkflowConfigurationsTable {
  Row: {
    id: string
    project_id: string
    name: string
    description: string | null
    configuration: Json
    is_active: boolean | null
    created_by: string
    created_at: string | null
    updated_at: string | null
  }
  Insert: {
    id?: string
    project_id: string
    name: string
    description?: string | null
    configuration: Json
    is_active?: boolean | null
    created_by: string
    created_at?: string | null
    updated_at?: string | null
  }
  Update: {
    id?: string
    project_id?: string
    name?: string
    description?: string | null
    configuration?: Json
    is_active?: boolean | null
    created_by?: string
    created_at?: string | null
    updated_at?: string | null
  }
}