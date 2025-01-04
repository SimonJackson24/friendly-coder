import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { BranchList } from "../BranchList";

interface BranchSectionProps {
  repositoryId: string | null;
  onSelectBranch: (branchId: string) => void;
  activeBranchId: string | null;
  onCreateCommit: () => void;
}

export function BranchSection({ 
  repositoryId, 
  onSelectBranch, 
  activeBranchId,
  onCreateCommit 
}: BranchSectionProps) {
  if (!repositoryId) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Select a repository to manage branches
        </p>
      </div>
    );
  }

  return (
    <Card className="space-y-4">
      <div className="flex justify-end">
        {activeBranchId && (
          <Button onClick={onCreateCommit}>
            <Plus className="h-4 w-4 mr-2" />
            Create Commit
          </Button>
        )}
      </div>
      <BranchList 
        repositoryId={repositoryId}
        onSelectBranch={onSelectBranch}
        activeBranchId={activeBranchId}
      />
    </Card>
  );
}