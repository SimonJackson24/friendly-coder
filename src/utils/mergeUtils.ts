import * as Diff from 'diff';
import { FileNode } from '@/hooks/useFileSystem';

export interface MergeResult {
  success: boolean;
  hasConflicts: boolean;
  mergedContent?: string;
  conflicts?: {
    file: FileNode;
    conflictingLines: number[];
  }[];
}

export function mergeFiles(baseContent: string, sourceContent: string, targetContent: string): MergeResult {
  try {
    // Generate diffs between base and both branches
    const sourceDiff = Diff.diffLines(baseContent, sourceContent);
    const targetDiff = Diff.diffLines(baseContent, targetContent);

    // Check for conflicting changes
    const conflicts = findConflicts(sourceDiff, targetDiff);
    
    if (conflicts.length > 0) {
      return {
        success: false,
        hasConflicts: true,
        conflicts: conflicts.map(conflict => ({
          file: conflict.file,
          conflictingLines: conflict.lines
        }))
      };
    }

    // If no conflicts, merge the changes
    const mergedContent = applyNonConflictingChanges(baseContent, sourceDiff, targetDiff);
    
    return {
      success: true,
      hasConflicts: false,
      mergedContent
    };
  } catch (error) {
    console.error('Error during merge:', error);
    return {
      success: false,
      hasConflicts: true
    };
  }
}

function findConflicts(sourceDiff: Diff.Change[], targetDiff: Diff.Change[]): Array<{ file: FileNode, lines: number[] }> {
  const conflicts: Array<{ file: FileNode, lines: number[] }> = [];
  let lineNumber = 1;

  // Compare changes line by line
  sourceDiff.forEach(sourceChange => {
    const sourceLines = sourceChange.value.split('\n');
    targetDiff.forEach(targetChange => {
      const targetLines = targetChange.value.split('\n');
      
      if (sourceChange.added && targetChange.added) {
        // Both branches modified the same lines
        conflicts.push({
          file: { 
            id: 'temp',
            name: 'file',
            type: 'file',
            path: 'path'
          },
          lines: [lineNumber]
        });
      }
      
      lineNumber += sourceLines.length;
    });
  });

  return conflicts;
}

function applyNonConflictingChanges(baseContent: string, sourceDiff: Diff.Change[], targetDiff: Diff.Change[]): string {
  let result = baseContent;

  // Apply source changes
  sourceDiff.forEach(change => {
    if (change.added) {
      result = result + change.value;
    } else if (change.removed) {
      result = result.replace(change.value, '');
    }
  });

  // Apply target changes
  targetDiff.forEach(change => {
    if (change.added) {
      result = result + change.value;
    } else if (change.removed) {
      result = result.replace(change.value, '');
    }
  });

  return result;
}