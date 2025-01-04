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
      ad_insights: {
        Row: {
          ad_metric_id: string | null
          confidence_score: number | null
          content: Json
          created_at: string | null
          id: string
          impact_score: number | null
          implemented: boolean | null
          insight_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ad_metric_id?: string | null
          confidence_score?: number | null
          content: Json
          created_at?: string | null
          id?: string
          impact_score?: number | null
          implemented?: boolean | null
          insight_type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ad_metric_id?: string | null
          confidence_score?: number | null
          content?: Json
          created_at?: string | null
          id?: string
          impact_score?: number | null
          implemented?: boolean | null
          insight_type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ad_insights_ad_metric_id_fkey"
            columns: ["ad_metric_id"]
            isOneToOne: false
            referencedRelation: "ad_metrics"
            referencedColumns: ["id"]
          },
        ]
      }
      ad_metrics: {
        Row: {
          clicks: number | null
          conversion_rate: number | null
          conversions: number | null
          cpc: number | null
          created_at: string | null
          ctr: number | null
          date: string | null
          id: string
          impressions: number | null
          platform: string
          revenue: number | null
          roas: number | null
          spend: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          clicks?: number | null
          conversion_rate?: number | null
          conversions?: number | null
          cpc?: number | null
          created_at?: string | null
          ctr?: number | null
          date?: string | null
          id?: string
          impressions?: number | null
          platform: string
          revenue?: number | null
          roas?: number | null
          spend?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          clicks?: number | null
          conversion_rate?: number | null
          conversions?: number | null
          cpc?: number | null
          created_at?: string | null
          ctr?: number | null
          date?: string | null
          id?: string
          impressions?: number | null
          platform?: string
          revenue?: number | null
          roas?: number | null
          spend?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ad_platform_api_configs: {
        Row: {
          access_token: string | null
          account_id: string | null
          additional_settings: Json | null
          api_key_id: string | null
          api_key_secret: string | null
          created_at: string | null
          id: string
          platform: string
          refresh_token: string | null
          token_expires_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token?: string | null
          account_id?: string | null
          additional_settings?: Json | null
          api_key_id?: string | null
          api_key_secret?: string | null
          created_at?: string | null
          id?: string
          platform: string
          refresh_token?: string | null
          token_expires_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string | null
          account_id?: string | null
          additional_settings?: Json | null
          api_key_id?: string | null
          api_key_secret?: string | null
          created_at?: string | null
          id?: string
          platform?: string
          refresh_token?: string | null
          token_expires_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
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
      board_cards: {
        Row: {
          column_id: string
          content: string
          created_at: string | null
          created_by: string
          id: string
          issue_id: string | null
          position: number
          updated_at: string | null
        }
        Insert: {
          column_id: string
          content: string
          created_at?: string | null
          created_by: string
          id?: string
          issue_id?: string | null
          position: number
          updated_at?: string | null
        }
        Update: {
          column_id?: string
          content?: string
          created_at?: string | null
          created_by?: string
          id?: string
          issue_id?: string | null
          position?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "board_cards_column_id_fkey"
            columns: ["column_id"]
            isOneToOne: false
            referencedRelation: "board_columns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "board_cards_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
        ]
      }
      board_columns: {
        Row: {
          board_id: string
          created_at: string | null
          id: string
          name: string
          position: number
          updated_at: string | null
        }
        Insert: {
          board_id: string
          created_at?: string | null
          id?: string
          name: string
          position: number
          updated_at?: string | null
        }
        Update: {
          board_id?: string
          created_at?: string | null
          id?: string
          name?: string
          position?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "board_columns_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "project_boards"
            referencedColumns: ["id"]
          },
        ]
      }
      branch_comparisons: {
        Row: {
          comparison_data: Json | null
          created_at: string | null
          created_by: string
          id: string
          repository_id: string
          source_branch_id: string
          target_branch_id: string
          updated_at: string | null
        }
        Insert: {
          comparison_data?: Json | null
          created_at?: string | null
          created_by: string
          id?: string
          repository_id: string
          source_branch_id: string
          target_branch_id: string
          updated_at?: string | null
        }
        Update: {
          comparison_data?: Json | null
          created_at?: string | null
          created_by?: string
          id?: string
          repository_id?: string
          source_branch_id?: string
          target_branch_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "branch_comparisons_repository_id_fkey"
            columns: ["repository_id"]
            isOneToOne: false
            referencedRelation: "repositories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "branch_comparisons_source_branch_id_fkey"
            columns: ["source_branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "branch_comparisons_target_branch_id_fkey"
            columns: ["target_branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      branch_protection_rules: {
        Row: {
          branch_id: string
          created_at: string | null
          created_by: string
          dismiss_stale_reviews: boolean | null
          enforce_admins: boolean | null
          id: string
          repository_id: string
          require_up_to_date: boolean | null
          required_approvals: number | null
          updated_at: string | null
        }
        Insert: {
          branch_id: string
          created_at?: string | null
          created_by: string
          dismiss_stale_reviews?: boolean | null
          enforce_admins?: boolean | null
          id?: string
          repository_id: string
          require_up_to_date?: boolean | null
          required_approvals?: number | null
          updated_at?: string | null
        }
        Update: {
          branch_id?: string
          created_at?: string | null
          created_by?: string
          dismiss_stale_reviews?: boolean | null
          enforce_admins?: boolean | null
          id?: string
          repository_id?: string
          require_up_to_date?: boolean | null
          required_approvals?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "branch_protection_rules_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "branch_protection_rules_repository_id_fkey"
            columns: ["repository_id"]
            isOneToOne: false
            referencedRelation: "repositories"
            referencedColumns: ["id"]
          },
        ]
      }
      branches: {
        Row: {
          created_at: string | null
          id: string
          is_default: boolean | null
          name: string
          repository_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          repository_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          repository_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "branches_repository_id_fkey"
            columns: ["repository_id"]
            isOneToOne: false
            referencedRelation: "repositories"
            referencedColumns: ["id"]
          },
        ]
      }
      build_environments: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_production: boolean | null
          name: string
          project_id: string
          updated_at: string | null
          variables: Json | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_production?: boolean | null
          name: string
          project_id: string
          updated_at?: string | null
          variables?: Json | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_production?: boolean | null
          name?: string
          project_id?: string
          updated_at?: string | null
          variables?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "build_environments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      build_steps: {
        Row: {
          build_id: string
          completed_at: string | null
          created_at: string | null
          error_message: string | null
          id: string
          started_at: string | null
          status: string
          step_config: Json | null
          step_logs: Json | null
          step_name: string
          step_type: string
          updated_at: string | null
        }
        Insert: {
          build_id: string
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          started_at?: string | null
          status?: string
          step_config?: Json | null
          step_logs?: Json | null
          step_name: string
          step_type: string
          updated_at?: string | null
        }
        Update: {
          build_id?: string
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          started_at?: string | null
          status?: string
          step_config?: Json | null
          step_logs?: Json | null
          step_name?: string
          step_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "build_steps_build_id_fkey"
            columns: ["build_id"]
            isOneToOne: false
            referencedRelation: "builds"
            referencedColumns: ["id"]
          },
        ]
      }
      build_triggers: {
        Row: {
          branch_pattern: string | null
          build_config: Json | null
          created_at: string | null
          created_by: string | null
          environment_id: string | null
          id: string
          is_active: boolean | null
          project_id: string
          trigger_type: string
          updated_at: string | null
        }
        Insert: {
          branch_pattern?: string | null
          build_config?: Json | null
          created_at?: string | null
          created_by?: string | null
          environment_id?: string | null
          id?: string
          is_active?: boolean | null
          project_id: string
          trigger_type: string
          updated_at?: string | null
        }
        Update: {
          branch_pattern?: string | null
          build_config?: Json | null
          created_at?: string | null
          created_by?: string | null
          environment_id?: string | null
          id?: string
          is_active?: boolean | null
          project_id?: string
          trigger_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "build_triggers_environment_id_fkey"
            columns: ["environment_id"]
            isOneToOne: false
            referencedRelation: "build_environments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "build_triggers_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      builds: {
        Row: {
          artifacts_urls: Json | null
          branch_name: string | null
          build_config: Json | null
          build_logs: Json | null
          build_number: number
          commit_sha: string | null
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          environment: string
          error_message: string | null
          id: string
          project_id: string
          started_at: string | null
          status: string
          trigger_type: string
          updated_at: string | null
        }
        Insert: {
          artifacts_urls?: Json | null
          branch_name?: string | null
          build_config?: Json | null
          build_logs?: Json | null
          build_number: number
          commit_sha?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          environment?: string
          error_message?: string | null
          id?: string
          project_id: string
          started_at?: string | null
          status?: string
          trigger_type?: string
          updated_at?: string | null
        }
        Update: {
          artifacts_urls?: Json | null
          branch_name?: string | null
          build_config?: Json | null
          build_logs?: Json | null
          build_number?: number
          commit_sha?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          environment?: string
          error_message?: string | null
          id?: string
          project_id?: string
          started_at?: string | null
          status?: string
          trigger_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "builds_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      code_reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          pull_request_id: string
          reviewer_id: string
          status: Database["public"]["Enums"]["review_status"]
          updated_at: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          pull_request_id: string
          reviewer_id: string
          status?: Database["public"]["Enums"]["review_status"]
          updated_at?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          pull_request_id?: string
          reviewer_id?: string
          status?: Database["public"]["Enums"]["review_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "code_reviews_pull_request_id_fkey"
            columns: ["pull_request_id"]
            isOneToOne: false
            referencedRelation: "pull_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      commit_changes: {
        Row: {
          change_type: string
          commit_id: string
          content: string | null
          created_at: string | null
          file_path: string
          id: string
        }
        Insert: {
          change_type: string
          commit_id: string
          content?: string | null
          created_at?: string | null
          file_path: string
          id?: string
        }
        Update: {
          change_type?: string
          commit_id?: string
          content?: string | null
          created_at?: string | null
          file_path?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "commit_changes_commit_id_fkey"
            columns: ["commit_id"]
            isOneToOne: false
            referencedRelation: "commits"
            referencedColumns: ["id"]
          },
        ]
      }
      commits: {
        Row: {
          author_id: string
          branch_id: string
          created_at: string | null
          id: string
          message: string
          parent_commit_id: string | null
        }
        Insert: {
          author_id: string
          branch_id: string
          created_at?: string | null
          id?: string
          message: string
          parent_commit_id?: string | null
        }
        Update: {
          author_id?: string
          branch_id?: string
          created_at?: string | null
          id?: string
          message?: string
          parent_commit_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commits_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commits_parent_commit_id_fkey"
            columns: ["parent_commit_id"]
            isOneToOne: false
            referencedRelation: "commits"
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
      deployment_history: {
        Row: {
          completed_at: string | null
          created_at: string | null
          created_by: string
          deployment_config: Json
          error_message: string | null
          id: string
          logs: Json | null
          project_id: string
          started_at: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          created_by: string
          deployment_config: Json
          error_message?: string | null
          id?: string
          logs?: Json | null
          project_id: string
          started_at?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          created_by?: string
          deployment_config?: Json
          error_message?: string | null
          id?: string
          logs?: Json | null
          project_id?: string
          started_at?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deployment_history_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      environment_clones: {
        Row: {
          created_at: string | null
          created_by: string
          diff_summary: Json | null
          id: string
          source_env_id: string
          target_env_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          diff_summary?: Json | null
          id?: string
          source_env_id: string
          target_env_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          diff_summary?: Json | null
          id?: string
          source_env_id?: string
          target_env_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "environment_clones_source_env_id_fkey"
            columns: ["source_env_id"]
            isOneToOne: false
            referencedRelation: "build_environments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "environment_clones_target_env_id_fkey"
            columns: ["target_env_id"]
            isOneToOne: false
            referencedRelation: "build_environments"
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
      issue_comments: {
        Row: {
          content: string
          created_at: string | null
          created_by: string
          id: string
          issue_id: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by: string
          id?: string
          issue_id: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string
          id?: string
          issue_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "issue_comments_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
        ]
      }
      issues: {
        Row: {
          assigned_to: string | null
          closed_at: string | null
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          labels: string[] | null
          repository_id: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          closed_at?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          labels?: string[] | null
          repository_id: string
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          closed_at?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          labels?: string[] | null
          repository_id?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "issues_repository_id_fkey"
            columns: ["repository_id"]
            isOneToOne: false
            referencedRelation: "repositories"
            referencedColumns: ["id"]
          },
        ]
      }
      milestone_issues: {
        Row: {
          created_at: string | null
          id: string
          issue_id: string
          milestone_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          issue_id: string
          milestone_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          issue_id?: string
          milestone_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "milestone_issues_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "milestone_issues_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
        ]
      }
      milestones: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          due_date: string | null
          id: string
          repository_id: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          due_date?: string | null
          id?: string
          repository_id: string
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          due_date?: string | null
          id?: string
          repository_id?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "milestones_repository_id_fkey"
            columns: ["repository_id"]
            isOneToOne: false
            referencedRelation: "repositories"
            referencedColumns: ["id"]
          },
        ]
      }
      package_access: {
        Row: {
          access_level: string
          created_at: string | null
          id: string
          package_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_level: string
          created_at?: string | null
          id?: string
          package_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_level?: string
          created_at?: string | null
          id?: string
          package_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "package_access_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      package_versions: {
        Row: {
          changes: string | null
          created_at: string | null
          id: string
          package_data: Json
          package_id: string
          published_by: string
          version: string
        }
        Insert: {
          changes?: string | null
          created_at?: string | null
          id?: string
          package_data: Json
          package_id: string
          published_by: string
          version: string
        }
        Update: {
          changes?: string | null
          created_at?: string | null
          id?: string
          package_data?: Json
          package_id?: string
          published_by?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "package_versions_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      packages: {
        Row: {
          author_id: string
          created_at: string | null
          description: string | null
          download_count: number | null
          id: string
          is_private: boolean | null
          name: string
          package_data: Json
          updated_at: string | null
          version: string
        }
        Insert: {
          author_id: string
          created_at?: string | null
          description?: string | null
          download_count?: number | null
          id?: string
          is_private?: boolean | null
          name: string
          package_data: Json
          updated_at?: string | null
          version: string
        }
        Update: {
          author_id?: string
          created_at?: string | null
          description?: string | null
          download_count?: number | null
          id?: string
          is_private?: boolean | null
          name?: string
          package_data?: Json
          updated_at?: string | null
          version?: string
        }
        Relationships: []
      }
      project_boards: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          name: string
          repository_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          name: string
          repository_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          name?: string
          repository_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_boards_repository_id_fkey"
            columns: ["repository_id"]
            isOneToOne: false
            referencedRelation: "repositories"
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
      pull_requests: {
        Row: {
          author_id: string
          created_at: string | null
          description: string | null
          has_conflicts: boolean | null
          id: string
          repository_id: string
          source_branch_id: string
          status: Database["public"]["Enums"]["pr_status"]
          target_branch_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id: string
          created_at?: string | null
          description?: string | null
          has_conflicts?: boolean | null
          id?: string
          repository_id: string
          source_branch_id: string
          status?: Database["public"]["Enums"]["pr_status"]
          target_branch_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          created_at?: string | null
          description?: string | null
          has_conflicts?: boolean | null
          id?: string
          repository_id?: string
          source_branch_id?: string
          status?: Database["public"]["Enums"]["pr_status"]
          target_branch_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pull_requests_repository_id_fkey"
            columns: ["repository_id"]
            isOneToOne: false
            referencedRelation: "repositories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pull_requests_source_branch_id_fkey"
            columns: ["source_branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pull_requests_target_branch_id_fkey"
            columns: ["target_branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      rebase_operations: {
        Row: {
          conflicts: Json | null
          created_at: string | null
          created_by: string
          id: string
          source_branch_id: string
          status: string
          target_branch_id: string
          updated_at: string | null
        }
        Insert: {
          conflicts?: Json | null
          created_at?: string | null
          created_by: string
          id?: string
          source_branch_id: string
          status?: string
          target_branch_id: string
          updated_at?: string | null
        }
        Update: {
          conflicts?: Json | null
          created_at?: string | null
          created_by?: string
          id?: string
          source_branch_id?: string
          status?: string
          target_branch_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rebase_operations_source_branch_id_fkey"
            columns: ["source_branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rebase_operations_target_branch_id_fkey"
            columns: ["target_branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      releases: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          name: string
          repository_id: string
          tag_name: string
          updated_at: string | null
          version: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          name: string
          repository_id: string
          tag_name: string
          updated_at?: string | null
          version: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          name?: string
          repository_id?: string
          tag_name?: string
          updated_at?: string | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "releases_repository_id_fkey"
            columns: ["repository_id"]
            isOneToOne: false
            referencedRelation: "repositories"
            referencedColumns: ["id"]
          },
        ]
      }
      repositories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_private: boolean | null
          name: string
          project_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_private?: boolean | null
          name: string
          project_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_private?: boolean | null
          name?: string
          project_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "repositories_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      repository_stars: {
        Row: {
          created_at: string | null
          id: string
          repository_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          repository_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          repository_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "repository_stars_repository_id_fkey"
            columns: ["repository_id"]
            isOneToOne: false
            referencedRelation: "repositories"
            referencedColumns: ["id"]
          },
        ]
      }
      repository_watchers: {
        Row: {
          created_at: string | null
          id: string
          notification_level: string
          repository_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          notification_level?: string
          repository_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          notification_level?: string
          repository_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "repository_watchers_repository_id_fkey"
            columns: ["repository_id"]
            isOneToOne: false
            referencedRelation: "repositories"
            referencedColumns: ["id"]
          },
        ]
      }
      review_comments: {
        Row: {
          content: string
          created_at: string | null
          file_path: string
          id: string
          line_number: number
          review_id: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          file_path: string
          id?: string
          line_number: number
          review_id: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          file_path?: string
          id?: string
          line_number?: number
          review_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "review_comments_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "code_reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      search_history: {
        Row: {
          created_at: string | null
          filters: Json | null
          id: string
          query: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          filters?: Json | null
          id?: string
          query: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          filters?: Json | null
          id?: string
          query?: string
          user_id?: string
        }
        Relationships: []
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
      wiki_page_history: {
        Row: {
          content: string
          created_at: string | null
          created_by: string
          id: string
          page_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by: string
          id?: string
          page_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string
          id?: string
          page_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wiki_page_history_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "wiki_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      wiki_pages: {
        Row: {
          content: string
          created_at: string | null
          created_by: string
          id: string
          repository_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by: string
          id?: string
          repository_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string
          id?: string
          repository_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wiki_pages_repository_id_fkey"
            columns: ["repository_id"]
            isOneToOne: false
            referencedRelation: "repositories"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_configurations: {
        Row: {
          configuration: Json
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          project_id: string
          updated_at: string | null
        }
        Insert: {
          configuration: Json
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          project_id: string
          updated_at?: string | null
        }
        Update: {
          configuration?: Json
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          project_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_configurations_project_id_fkey"
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
      get_next_build_number: {
        Args: {
          p_project_id: string
        }
        Returns: number
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
      pr_status: "open" | "closed" | "merged" | "draft"
      review_status: "pending" | "approved" | "changes_requested" | "commented"
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
