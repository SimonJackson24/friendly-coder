import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, Users, BookOpen, GitBranch } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { RepoActivity } from "./RepoActivity";
import { RepoContributors } from "./RepoContributors";
import { ReadmePreview } from "./ReadmePreview";
import { BranchStats } from "./BranchStats";

interface RepoOverviewProps {
  repositoryId: string;
}

export function RepoOverview({ repositoryId }: RepoOverviewProps) {
  const { data: repository } = useQuery({
    queryKey: ["repository", repositoryId],
    queryFn: async () => {
      console.log("Fetching repository:", repositoryId);
      const { data, error } = await supabase
        .from("repositories")
        .select("*")
        .eq("id", repositoryId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (!repository) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Recent Activity</h3>
        </div>
        <ScrollArea className="h-[300px]">
          <RepoActivity repositoryId={repositoryId} />
        </ScrollArea>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Contributors</h3>
        </div>
        <RepoContributors repositoryId={repositoryId} />
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">README</h3>
        </div>
        <ReadmePreview repositoryId={repositoryId} />
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <GitBranch className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Branch Statistics</h3>
        </div>
        <BranchStats repositoryId={repositoryId} />
      </Card>
    </div>
  );
}