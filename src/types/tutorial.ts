import { Json } from "@/integrations/supabase/types/database";

export interface TutorialQuiz {
  question: string;
  options: string[];
  correct: number;
}

export interface TutorialStep {
  index: number;
  title: string;
  content: string;
  type: 'reading' | 'exercise' | 'challenge';
  duration: number;
  quiz?: TutorialQuiz;
}

export interface Tutorial {
  id: string;
  title: string;
  content: string;
  difficulty_level: string;
  category: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  is_published: boolean;
  steps: TutorialStep[];
  has_interactive_elements: boolean;
  estimated_duration?: number;
  prerequisites?: Json[];
}