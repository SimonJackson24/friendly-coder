import { Json } from './database';

export interface FilesTable {
  Row: {
    build_status: string | null
    content: string | null
    created_at: string | null
    id: string
    name: string
    path: string
    project_id: string
    type: string
    updated_at: string | null
  }
  Insert: {
    build_status?: string | null
    content?: string | null
    created_at?: string | null
    id?: string
    name: string
    path: string
    project_id: string
    type: string
    updated_at?: string | null
  }
  Update: {
    build_status?: string | null
    content?: string | null
    created_at?: string | null
    id?: string
    name?: string
    path?: string
    project_id?: string
    type?: string
    updated_at?: string | null
  }
}

export interface ProjectsTable {
  Row: {
    created_at: string | null
    description: string | null
    forked_from: string | null
    github_url: string | null
    id: string
    is_template: boolean | null
    status: string
    supabase_url: string | null
    title: string
    updated_at: string | null
    user_id: string
    project_type: string
    github_import_status: string | null
    github_import_error: string | null
    github_branch: string | null
    github_commit_sha: string | null
  }
  Insert: {
    created_at?: string | null
    description?: string | null
    forked_from?: string | null
    github_url?: string | null
    id?: string
    is_template?: boolean | null
    status?: string
    supabase_url?: string | null
    title: string
    updated_at?: string | null
    user_id: string
    project_type?: string
    github_import_status?: string | null
    github_import_error?: string | null
    github_branch?: string | null
    github_commit_sha?: string | null
  }
  Update: {
    created_at?: string | null
    description?: string | null
    forked_from?: string | null
    github_url?: string | null
    id?: string
    is_template?: boolean | null
    status?: string
    supabase_url?: string | null
    title?: string
    updated_at?: string | null
    user_id?: string
    project_type?: string
    github_import_status?: string | null
    github_import_error?: string | null
    github_branch?: string | null
    github_commit_sha?: string | null
  }
}

export interface SettingsTable {
  Row: {
    id: string
    user_id: string
    created_at: string | null
    updated_at: string | null
    api_key: string | null
    temperature: number | null
    max_tokens: number | null
    anthropic_model: string | null
    github_token: string | null
    default_deployment_platform: string | null
    default_package_registry: string | null
    platform_settings: Json | null
    huggingface_model: string | null
    model_parameters: Json | null
  }
  Insert: {
    id?: string
    user_id: string
    created_at?: string | null
    updated_at?: string | null
    api_key?: string | null
    temperature?: number | null
    max_tokens?: number | null
    anthropic_model?: string | null
    github_token?: string | null
    default_deployment_platform?: string | null
    default_package_registry?: string | null
    platform_settings?: Json | null
    huggingface_model?: string | null
    model_parameters?: Json | null
  }
  Update: {
    id?: string
    user_id?: string
    created_at?: string | null
    updated_at?: string | null
    api_key?: string | null
    temperature?: number | null
    max_tokens?: number | null
    anthropic_model?: string | null
    github_token?: string | null
    default_deployment_platform?: string | null
    default_package_registry?: string | null
    platform_settings?: Json | null
    huggingface_model?: string | null
    model_parameters?: Json | null
  }
}

export interface SupabaseConnectionsTable {
  Row: {
    access_token: string
    created_at: string | null
    expires_at: string
    id: string
    refresh_token: string
    updated_at: string | null
    user_id: string
  }
  Insert: {
    access_token: string
    created_at?: string | null
    expires_at: string
    id?: string
    refresh_token: string
    updated_at?: string | null
    user_id: string
  }
  Update: {
    access_token?: string
    created_at?: string | null
    expires_at?: string
    id?: string
    refresh_token?: string
    updated_at?: string | null
    user_id?: string
  }
}

export interface VersionHistoryTable {
  Row: {
    build_status: string
    commit_message: string | null
    content: string | null
    created_at: string | null
    created_by: string | null
    error_logs: string[] | null
    file_id: string
    id: string
    project_id: string
    version_number: number
  }
  Insert: {
    build_status?: string
    commit_message?: string | null
    content?: string | null
    created_at?: string | null
    created_by?: string | null
    error_logs?: string[] | null
    file_id: string
    id?: string
    project_id: string
    version_number: number
  }
  Update: {
    build_status?: string
    commit_message?: string | null
    content?: string | null
    created_at?: string | null
    created_by?: string | null
    error_logs?: string[] | null
    file_id?: string
    id?: string
    project_id?: string
    version_number?: number
  }
}

export interface AdCampaignsTable {
  Row: {
    id: string;
    user_id: string;
    name: string;
    description: string | null;
    status: string;
    budget: number;
    spent: number;
    reach: number;
    start_date: string | null;
    end_date: string | null;
    targeting: Json;
    schedule: Json;
    budget_allocation: Json;
    created_at: string | null;
    updated_at: string | null;
  };
  Insert: {
    id?: string;
    user_id: string;
    name: string;
    description?: string | null;
    status?: string;
    budget?: number;
    spent?: number;
    reach?: number;
    start_date?: string | null;
    end_date?: string | null;
    targeting?: Json;
    schedule?: Json;
    budget_allocation?: Json;
    created_at?: string | null;
    updated_at?: string | null;
  };
  Update: {
    id?: string;
    user_id?: string;
    name?: string;
    description?: string | null;
    status?: string;
    budget?: number;
    spent?: number;
    reach?: number;
    start_date?: string | null;
    end_date?: string | null;
    targeting?: Json;
    schedule?: Json;
    budget_allocation?: Json;
    created_at?: string | null;
    updated_at?: string | null;
  };
}

// Update the Database interface to include the new table
export interface Database {
  public: {
    Tables: {
      files: FilesTable;
      projects: ProjectsTable;
      settings: SettingsTable;
      supabase_connections: SupabaseConnectionsTable;
      version_history: VersionHistoryTable;
      ad_campaigns: AdCampaignsTable;
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
