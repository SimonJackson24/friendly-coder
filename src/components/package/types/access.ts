import { AccessLevel } from './common';

export interface AccessRequest {
  id: string;
  user_id: string;
  package_id: string;
  requested_level: AccessLevel;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}