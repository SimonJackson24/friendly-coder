import { FilesTable, ProjectsTable, SettingsTable, SupabaseConnectionsTable, VersionHistoryTable } from './tables';
import { WorkflowConfigurationsTable } from './workflow';
import { DatabaseFunctions } from './functions';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      files: FilesTable
      projects: ProjectsTable
      settings: SettingsTable
      supabase_connections: SupabaseConnectionsTable
      version_history: VersionHistoryTable
      workflow_configurations: WorkflowConfigurationsTable
    }
    Views: {
      [_ in never]: never
    }
    Functions: DatabaseFunctions
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}