import { Card } from "@/components/ui/card";
import { CommitHistory } from "../CommitHistory";

interface CommitSectionProps {
  branchId: string | null;
}

export function CommitSection({ branchId }: CommitSectionProps) {
  if (!branchId) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Select a branch to view commit history
        </p>
      </div>
    );
  }

  return (
    <Card className="space-y-4">
      <CommitHistory branchId={branchId} />
    </Card>
  );
}