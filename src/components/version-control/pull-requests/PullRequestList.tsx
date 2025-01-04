import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GitPullRequest, GitMerge, XCircle, MessageSquare } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface PullRequest {
  id: string;
  title: string;
  description: string | null;
  status: 'open' | 'closed' | 'merged' | 'draft';
  created_at: string;
  author: { email: string };
  source_branch: { name: string };
  target_branch: { name: string };
}

interface PullRequestListProps {
  repositoryId: string;
  onSelectPullRequest?: (pr: PullRequest) => void;
}

export function PullRequestList({ repositoryId, onSelectPullRequest }: PullRequestListProps) {
  const { data: pullRequests, isLoading } = useQuery({
    queryKey: ["pullRequests", repositoryId],
    queryFn: async () => {
      console.log("Fetching pull requests for repository:", repositoryId);
      const { data, error } = await supabase
        .from("pull_requests")
        .select(`
          *,
          author:author_id(email),
          source_branch:source_branch_id(name),
          target_branch:target_branch_id(name)
        `)
        .eq("repository_id", repositoryId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching pull requests:", error);
        throw error;
      }

      return data as PullRequest[];
    },
    enabled: !!repositoryId,
  });

  if (isLoading) {
    return <div>Loading pull requests...</div>;
  }

  if (!pullRequests?.length) {
    return (
      <Card className="p-4 text-center text-muted-foreground">
        No pull requests found
      </Card>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "merged":
        return <GitMerge className="h-4 w-4 text-green-500" />;
      case "closed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "draft":
        return <GitPullRequest className="h-4 w-4 text-gray-500" />;
      default:
        return <GitPullRequest className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "merged":
        return "bg-green-500/10 text-green-500";
      case "closed":
        return "bg-red-500/10 text-red-500";
      case "draft":
        return "bg-gray-500/10 text-gray-500";
      default:
        return "bg-blue-500/10 text-blue-500";
    }
  };

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-4">
        {pullRequests.map((pr) => (
          <Card 
            key={pr.id} 
            className="p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onSelectPullRequest?.(pr)}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {getStatusIcon(pr.status)}
                  <h3 className="font-medium">{pr.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {pr.source_branch?.name} → {pr.target_branch?.name}
                </p>
              </div>
              <Badge className={getStatusColor(pr.status)}>
                {pr.status}
              </Badge>
            </div>
            {pr.description && (
              <p className="mt-2 text-sm text-muted-foreground">
                {pr.description}
              </p>
            )}
            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Created by {pr.author?.email} on{" "}
                {new Date(pr.created_at).toLocaleDateString()}
              </span>
              <Button variant="ghost" size="sm" className="gap-1">
                <MessageSquare className="h-4 w-4" />
                Review
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}