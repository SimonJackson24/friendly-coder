export interface LearningPath {
  id: string;
  title: string;
  description: string | null;
  difficulty_level: string;
  category: string;
  created_by: string | null;
  created_at: string | null;
  updated_at: string | null;
  is_published: boolean;
  estimated_duration: number | null;
  prerequisites: any[];
}

export interface Tutorial {
  id: string;
  title: string;
  content: string;
  difficulty_level: string;
  category: string;
  created_at: string | null;
  updated_at: string | null;
  created_by: string | null;
  is_published: boolean;
  steps: any[];
  has_interactive_elements: boolean;
  estimated_duration: number;
  prerequisites: any[];
}