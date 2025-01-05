export type ProjectType = 'responsive-pwa' | 'fullstack' | 'android' | 'web-to-android' | 'web';

export interface Project {
  id: string;
  title: string;
  description: string | null;
  status: string;
  user_id: string;
  project_type: ProjectType;
  created_at?: string;
  updated_at?: string;
}