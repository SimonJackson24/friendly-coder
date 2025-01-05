import { AccessLevel } from './common';

export interface TeamAccess {
  id: string;
  team_id: string;
  package_id: string;
  access_level: AccessLevel;
  created_at: string;
  updated_at: string;
}