export interface ReleaseNote {
  id: string;
  package_id: string;
  version: string;
  title: string;
  description: string;
  changes: string[];
  breaking_changes: string[];
  changelog_type: 'feature' | 'bugfix' | 'breaking' | 'maintenance';
  impact_level: 'minor' | 'major' | 'patch';
  affected_components: string[];
  migration_steps: Record<string, any>;
  created_at: string;
}

export interface ChangeCategory {
  id: string;
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  requires_approval: boolean;
}