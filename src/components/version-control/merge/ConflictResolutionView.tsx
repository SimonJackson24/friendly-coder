/**
 * Copyright (c) 2024. All Rights Reserved.
 * 
 * This file is part of the proprietary software developed by the copyright holder.
 * 
 * This software uses the following open source packages under their respective licenses:
 * - @tanstack/react-query: MIT License (https://github.com/tanstack/query/blob/main/LICENSE)
 * - shadcn/ui components: MIT License (https://github.com/shadcn/ui/blob/main/LICENSE.md)
 * - React Router: MIT License (https://github.com/remix-run/react-router/blob/main/LICENSE.md)
 * - Lucide Icons: MIT License (https://github.com/lucide-icons/lucide/blob/main/LICENSE)
 * 
 * While these dependencies are open source, this file and its contents remain proprietary
 * and may not be copied, modified, or distributed without explicit permission.
 */

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
