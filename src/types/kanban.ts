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
  cards: BoardCard[];
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