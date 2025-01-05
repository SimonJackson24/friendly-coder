import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";

interface RepoContributorsProps {
  repositoryId: string;
}

export function RepoContributors({ repositoryId }: RepoContributorsProps) {
  const { data: contributors, isLoading } = useQuery({
    queryKey: ["repository-contributors", repositoryId],
    queryFn: async () => {
      console.log("Fetching repository contributors:", repositoryId);
      
      const { data: commits, error } = await supabase
        .from("commits")
        .select(`
          author_id,
          author:author_id (
            email
          )
        `)
        .eq("branch_id", repositoryId);

      if (error) throw error;

      // Get unique contributors and count their commits
      const contributorMap = new Map();
      commits.forEach((commit) => {
        const email = commit.author?.email || 'Unknown';
        if (!contributorMap.has(email)) {
          contributorMap.set(email, {
            email: email,
            commitCount: 1
          });
        } else {
          contributorMap.get(email).commitCount++;
        }
      });

      return Array.from(contributorMap.values());
    },
  });

  if (isLoading) {
    return <div>Loading contributors...</div>;
  }

  return (
    <div className="space-y-4">
      {contributors?.map((contributor) => (
        <div key={contributor.email} className="flex items-center gap-4">
          <Avatar>
            <AvatarFallback>
              {contributor.email.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{contributor.email}</p>
            <p className="text-xs text-muted-foreground">
              {contributor.commitCount} commits
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}