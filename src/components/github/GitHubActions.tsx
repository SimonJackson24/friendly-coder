import { Button } from "@/components/ui/button";
import { GitBranch, GitCommit, GitFork, GitMerge, GitPullRequest } from "lucide-react";

interface GitHubActionsProps {
  repoUrl: string | null;
  onCreatePR: () => void;
  onCreateBranch: () => void;
  onCommit: () => void;
}

export function GitHubActions({ repoUrl, onCreatePR, onCreateBranch, onCommit }: GitHubActionsProps) {
  if (!repoUrl) return null;

  return (
    <div className="flex gap-2 flex-wrap">
      <Button variant="outline" size="sm" onClick={onCreateBranch}>
        <GitBranch className="w-4 h-4 mr-2" />
        New Branch
      </Button>
      <Button variant="outline" size="sm" onClick={onCommit}>
        <GitCommit className="w-4 h-4 mr-2" />
        Commit Changes
      </Button>
      <Button variant="outline" size="sm" onClick={onCreatePR}>
        <GitPullRequest className="w-4 h-4 mr-2" />
        Create PR
      </Button>
    </div>
  );
}