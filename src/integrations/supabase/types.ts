export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ad_platform_connections: {
        Row: {
          access_token: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          platform: string
          platform_settings: Json | null
          refresh_token: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          platform: string
          platform_settings?: Json | null
          refresh_token?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          platform?: string
          platform_settings?: Json | null
          refresh_token?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      android_builds: {
        Row: {
          apk_url: string | null
          build_config: Json | null
          build_logs: string[] | null
          created_at: string | null
          error_context: Json | null
          id: string
          package_name: string
          project_id: string
          status: string
          updated_at: string | null
          version_code: number
          version_name: string
        }
        Insert: {
          apk_url?: string | null
          build_config?: Json | null
          build_logs?: string[] | null
          created_at?: string | null
          error_context?: Json | null
          id?: string
          package_name: string
          project_id: string
          status?: string
          updated_at?: string | null
          version_code?: number
          version_name?: string
        }
        Update: {
          apk_url?: string | null
          build_config?: Json | null
          build_logs?: string[] | null
          created_at?: string | null
          error_context?: Json | null
          id?: string
          package_name?: string
          project_id?: string
          status?: string
          updated_at?: string | null
          version_code?: number
          version_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "android_builds_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      debug_logs: {
        Row: {
          context: Json | null
          created_at: string | null
          id: string
          log_type: string
          message: string
          project_id: string | null
          resolution_notes: string | null
          resolved_at: string | null
          severity: string
          stack_trace: string | null
        }
        Insert: {
          context?: Json | null
          created_at?: string | null
          id?: string
          log_type: string
          message: string
          project_id?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          severity: string
          stack_trace?: string | null
        }
        Update: {
          context?: Json | null
          created_at?: string | null
          id?: string
          log_type?: string
          message?: string
          project_id?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          severity?: string
          stack_trace?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "debug_logs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      files: {
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
        Relationships: [
          {
            foreignKeyName: "files_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string | null
          description: string | null
          forked_from: string | null
          github_branch: string | null
          github_commit_sha: string | null
          github_import_error: string | null
          github_import_status: string | null
          github_url: string | null
          id: string
          is_template: boolean | null
          project_type: string
          status: string
          supabase_url: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          forked_from?: string | null
          github_branch?: string | null
          github_commit_sha?: string | null
          github_import_error?: string | null
          github_import_status?: string | null
          github_url?: string | null
          id?: string
          is_template?: boolean | null
          project_type?: string
          status?: string
          supabase_url?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          forked_from?: string | null
          github_branch?: string | null
          github_commit_sha?: string | null
          github_import_error?: string | null
          github_import_status?: string | null
          github_url?: string | null
          id?: string
          is_template?: boolean | null
          project_type?: string
          status?: string
          supabase_url?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_forked_from_fkey"
            columns: ["forked_from"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          anthropic_model: string | null
          api_key: string | null
          build_preferences: Json | null
          created_at: string | null
          default_deployment_platform: string | null
          default_package_registry: string | null
          editor_preferences: Json | null
          github_token: string | null
          id: string
          language: string | null
          max_tokens: number | null
          model_parameters: Json | null
          notifications: Json | null
          platform_settings: Json | null
          security_preferences: Json | null
          temperature: number | null
          theme: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          anthropic_model?: string | null
          api_key?: string | null
          build_preferences?: Json | null
          created_at?: string | null
          default_deployment_platform?: string | null
          default_package_registry?: string | null
          editor_preferences?: Json | null
          github_token?: string | null
          id?: string
          language?: string | null
          max_tokens?: number | null
          model_parameters?: Json | null
          notifications?: Json | null
          platform_settings?: Json | null
          security_preferences?: Json | null
          temperature?: number | null
          theme?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          anthropic_model?: string | null
          api_key?: string | null
          build_preferences?: Json | null
          created_at?: string | null
          default_deployment_platform?: string | null
          default_package_registry?: string | null
          editor_preferences?: Json | null
          github_token?: string | null
          id?: string
          language?: string | null
          max_tokens?: number | null
          model_parameters?: Json | null
          notifications?: Json | null
          platform_settings?: Json | null
          security_preferences?: Json | null
          temperature?: number | null
          theme?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      settings_history: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          operation_type: string
          settings_data: Json
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          operation_type: string
          settings_data: Json
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          operation_type?: string
          settings_data?: Json
          user_id?: string
        }
        Relationships: []
      }
      supabase_connections: {
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
        Relationships: []
      }
      team_members: {
        Row: {
          created_at: string | null
          id: string
          role: string
          team_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: string
          team_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          team_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string | null
          created_by: string
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tutorials: {
        Row: {
          category: string
          content: string
          created_at: string | null
          created_by: string | null
          difficulty_level: string
          id: string
          is_published: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          content: string
          created_at?: string | null
          created_by?: string | null
          difficulty_level: string
          id?: string
          is_published?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          content?: string
          created_at?: string | null
          created_by?: string | null
          difficulty_level?: string
          id?: string
          is_published?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          points: number | null
          tutorial_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          points?: number | null
          tutorial_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          points?: number | null
          tutorial_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_tutorial_id_fkey"
            columns: ["tutorial_id"]
            isOneToOne: false
            referencedRelation: "tutorials"
            referencedColumns: ["id"]
          },
        ]
      }
      version_history: {
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
        Relationships: [
          {
            foreignKeyName: "version_history_file_id_fkey"
            columns: ["file_id"]
            isOneToOne: false
            referencedRelation: "files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "version_history_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      clean_old_debug_logs: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_next_version_number: {
        Args: {
          p_project_id: string
          p_file_id: string
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
