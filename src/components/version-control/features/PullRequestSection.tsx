import { Card } from "@/components/ui/card";
import { CreatePullRequest } from "../pull-requests/CreatePullRequest";
import { PullRequestList } from "../pull-requests/PullRequestList";

interface PullRequestSectionProps {
  repositoryId: string | null;
  activeBranchId: string | null;
  targetBranchId: string | null;
}

export function PullRequestSection({ 
  repositoryId, 
  activeBranchId, 
  targetBranchId 
}: PullRequestSectionProps) {
  if (!repositoryId) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Select a repository to view pull requests
        </p>
      </div>
    );
  }

  return (
    <Card className="space-y-4">
      <div className="flex justify-end">
        {activeBranchId && targetBranchId && (
          <CreatePullRequest
            repositoryId={repositoryId}
            sourceBranchId={activeBranchId}
            targetBranchId={targetBranchId}
          />
        )}
      </div>
      <PullRequestList repositoryId={repositoryId} />
    </Card>
  );
}