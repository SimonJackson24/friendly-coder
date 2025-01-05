import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";

interface RepoContributorsProps {
  repositoryId: string;
}

interface Contributor {
  email: string;
  commitCount: number;
}

interface CommitAuthor {
  email: string | null;
}

interface CommitWithAuthor {
  author: CommitAuthor | null;
}

export function RepoContributors({ repositoryId }: RepoContributorsProps) {
  const { data: contributors, isLoading } = useQuery({
    queryKey: ["repository-contributors", repositoryId],
    queryFn: async () => {
      console.log("Fetching repository contributors:", repositoryId);
      
      // Join with auth.users table to get author email
      const { data: commits, error } = await supabase
        .from("commits")
        .select(`
          author:author_id (
            email
          )
        `)
        .eq("branch_id", repositoryId);

      if (error) {
        console.error("Error fetching commits:", error);
        throw error;
      }

      console.log("Fetched commits:", commits);

      // Get unique contributors and count their commits
      const contributorMap = new Map<string, Contributor>();
      commits.forEach((commit: any) => {
        const email = commit.author?.email || 'Unknown';
        if (!contributorMap.has(email)) {
          contributorMap.set(email, {
            email: email,
            commitCount: 1
          });
        } else {
          const contributor = contributorMap.get(email);
          if (contributor) {
            contributor.commitCount++;
          }
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