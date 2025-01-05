import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MergeConflictResolver } from "../MergeConflictResolver";
import { MergeConflict } from "@/utils/mergeConflictUtils";
import { FileNode } from "@/hooks/useFileSystem";

interface ConflictResolutionViewProps {
  isLoading: boolean;
  conflicts: MergeConflict[];
  currentConflictIndex: number;
  onConflictResolved: () => void;
  onMerge: () => void;
}

export function ConflictResolutionView({
  isLoading,
  conflicts,
  currentConflictIndex,
  onConflictResolved,
  onMerge
}: ConflictResolutionViewProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (conflicts.length === 0) {
    return (
      <div className="text-center py-4 space-y-2">
        <Check className="h-8 w-8 text-green-500 mx-auto" />
        <div className="text-lg font-medium">No conflicts found</div>
        <div className="text-sm text-muted-foreground">
          The branches can be merged automatically
        </div>
        <Button onClick={onMerge}>
          Complete Merge
        </Button>
      </div>
    );
  }

  return (
    <MergeConflictResolver
      file={conflicts[currentConflictIndex] as unknown as FileNode}
      conflict={conflicts[currentConflictIndex]}
      onResolved={onConflictResolved}
    />
  );
}