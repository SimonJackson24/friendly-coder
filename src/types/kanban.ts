export interface BoardCard {
  id: string;
  content: string;
  position: number;
  issue_id?: string;
  created_by: string;
  created_at?: string;
  updated_at?: string;
}

export interface BoardColumn {
  id: string;
  name: string;
  position: number;
  board_cards: BoardCard[];
  created_at?: string;
  updated_at?: string;
}

export interface ProjectBoard {
  id: string;
  name: string;
  description?: string;
  repository_id: string;
  created_by: string;
  created_at?: string;
  updated_at?: string;
}

export interface ComparisonData {
  source_content: string;
  target_content: string;
}

export interface BranchComparison {
  id: string;
  repository_id: string;
  source_branch_id: string;
  target_branch_id: string;
  comparison_data: ComparisonData;
  created_at: string;
  updated_at: string;
  created_by: string;
}