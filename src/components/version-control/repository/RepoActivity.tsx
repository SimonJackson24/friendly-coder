import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

interface CommitAuthor {
  email: string;
}

interface Commit {
  id: string;
  message: string;
  created_at: string;
  author: CommitAuthor | null;
}

export function RepoActivity({ repositoryId }: { repositoryId: string }) {
  const { data: activities } = useQuery({
    queryKey: ["repo-activity", repositoryId],
    queryFn: async () => {
      console.log("Fetching repository activity:", repositoryId);
      const { data, error } = await supabase
        .from("commits")
        .select(`
          id,
          message,
          created_at,
          author:author_id (
            email
          )
        `)
        .eq("branch_id", repositoryId)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as unknown as Commit[];
    },
  });

  if (!activities?.length) {
    return <div className="text-muted-foreground">No recent activity</div>;
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-2">
          <div className="flex-1">
            <p className="text-sm font-medium">{activity.message}</p>
            <p className="text-xs text-muted-foreground">
              by {activity.author?.email || 'Unknown'} • {formatDistanceToNow(new Date(activity.created_at))} ago
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}