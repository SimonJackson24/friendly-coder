import { Json } from './database';

export interface LearningPath {
  id: string;
  title: string;
  description: string | null;
  difficulty_level: string;
  category: string;
  created_by: string | null;
  created_at: string | null;
  updated_at: string | null;
  is_published: boolean | null;
  estimated_duration: number | null;
  prerequisites: Json | null;
}

export interface UserProgress {
  id: string;
  user_id: string;
  tutorial_id: string | null;
  learning_path_id: string | null;
  completed_at: string | null;
  points: number | null;
  created_at: string | null;
  updated_at: string | null;
}