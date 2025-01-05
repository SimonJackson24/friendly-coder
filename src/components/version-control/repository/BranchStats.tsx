import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";

export function BranchStats({ repositoryId }: { repositoryId: string }) {
  const { data: stats } = useQuery({
    queryKey: ["branch-stats", repositoryId],
    queryFn: async () => {
      console.log("Fetching branch statistics:", repositoryId);
      const { data: branches, error } = await supabase
        .from("branches")
        .select(`
          id,
          name,
          commits:commits(count)
        `)
        .eq("repository_id", repositoryId);

      if (error) throw error;

      const totalCommits = branches.reduce((sum, branch) => sum + branch.commits.length, 0);
      
      return branches.map(branch => ({
        ...branch,
        commitCount: branch.commits.length,
        percentage: totalCommits ? (branch.commits.length / totalCommits) * 100 : 0
      }));
    },
  });

  if (!stats?.length) {
    return <div className="text-muted-foreground">No branches found</div>;
  }

  return (
    <div className="space-y-4">
      {stats.map((branch) => (
        <div key={branch.id} className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">{branch.name}</span>
            <span className="text-muted-foreground">{branch.commitCount} commits</span>
          </div>
          <Progress value={branch.percentage} className="h-2" />
        </div>
      ))}
    </div>
  );
}