import { MergeConflict } from "@/utils/mergeConflictUtils";

export interface MergeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  sourceBranchId: string;
  targetBranchId: string;
  onMergeComplete: () => void;
}

export interface ConflictData {
  conflicts: MergeConflict[];
  currentConflictIndex: number;
  isLoading: boolean;
}