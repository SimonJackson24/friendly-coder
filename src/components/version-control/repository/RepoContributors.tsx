import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function RepoContributors({ repositoryId }: { repositoryId: string }) {
  const { data: contributors } = useQuery({
    queryKey: ["repo-contributors", repositoryId],
    queryFn: async () => {
      console.log("Fetching repository contributors:", repositoryId);
      const { data, error } = await supabase
        .from("commits")
        .select(`
          author:author_id(email),
          count
        `)
        .eq("branch_id", repositoryId)
        .group("author_id")
        .count();

      if (error) throw error;
      return data;
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
              {contributor.count} commits
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}