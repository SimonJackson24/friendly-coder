/**
 * Copyright (c) 2024. All Rights Reserved.
 * 
 * This file is part of the proprietary software developed by the copyright holder.
 * Contains type definitions for the tutorial system.
 * 
 * All rights reserved. No part of this software may be reproduced, distributed, or
 * transmitted in any form or by any means without explicit permission.
 */

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
  prerequisites?: string[];
}