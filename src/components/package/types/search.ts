export interface SearchHistoryItem {
  id: string;
  query: string;
  filters: Record<string, any>;
  created_at: string;
}