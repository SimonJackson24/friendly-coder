import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Contributor {
  author: {
    email: string;
  } | null;
  commit_count: number;
}

export function RepoContributors({ repositoryId }: { repositoryId: string }) {
  const { data: contributors } = useQuery({
    queryKey: ["repo-contributors", repositoryId],
    queryFn: async () => {
      console.log("Fetching repository contributors:", repositoryId);
      
      const { data: commits, error } = await supabase
        .from("commits")
        .select(`
          author:author_id (
            email
          )
        `)
        .eq("branch_id", repositoryId);

      if (error) throw error;

      // Then manually count contributions
      const contributorMap = new Map<string, number>();
      commits.forEach(commit => {
        if (commit.author?.email) {
          const count = contributorMap.get(commit.author.email) || 0;
          contributorMap.set(commit.author.email, count + 1);
        }
      });

      // Convert to array format
      return Array.from(contributorMap.entries()).map(([email, count]) => ({
        author: { email },
        commit_count: count
      }));
    },
  });

  if (!contributors?.length) {
    return <div className="text-muted-foreground">No contributors yet</div>;
  }

  return (
    <div className="flex flex-wrap gap-4">
      {contributors.map((contributor) => (
        <div key={contributor.author?.email} className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {contributor.author?.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{contributor.author?.email}</p>
            <p className="text-xs text-muted-foreground">
              {contributor.commit_count} commits
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}