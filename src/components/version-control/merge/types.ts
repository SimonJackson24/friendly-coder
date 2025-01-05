/**
 * Copyright (c) 2024. All Rights Reserved.
 * 
 * This file is part of the proprietary software developed by the copyright holder.
 * 
 * This software uses the following open source packages under their respective licenses:
 * - @supabase/supabase-js: MIT License (https://github.com/supabase/supabase-js/blob/main/LICENSE)
 * 
 * While these dependencies are open source, this file and its contents remain proprietary
 * and may not be copied, modified, or distributed without explicit permission.
 */

export interface MergeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  sourceBranchId: string;
  targetBranchId: string;
  onMergeComplete: () => void;
}

export interface MergeConflict {
  id: string;
  filePath: string;
  conflictLines: string[];
  resolutionStatus: 'resolved' | 'unresolved';
}

export interface MergeResult {
  success: boolean;
  message: string;
  conflicts?: MergeConflict[];
}

export interface MergeOptions {
  allowFastForward?: boolean;
  commitMessage?: string;
}