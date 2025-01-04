export interface IssueComment {
  id: string;
  content: string;
  created_at: string;
  created_by: {
    email: string;
  };
}

export interface Issue {
  id: string;
  title: string;
  description: string | null;
  status: string;
  labels: string[] | null;
  created_at: string;
  created_by_user: {
    email: string;
  };
  assigned_to_user: {
    email: string;
  } | null;
  comments: IssueComment[];
}