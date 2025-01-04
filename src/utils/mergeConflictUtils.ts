import { FileNode } from '@/hooks/useFileSystem';
import * as Diff from 'diff';

export interface ConflictMarker {
  start: number;
  end: number;
  content: string;
  type: 'incoming' | 'current';
}

export interface MergeConflict {
  filePath: string;
  conflicts: ConflictMarker[];
  baseContent: string;
  incomingContent: string;
  currentContent: string;
}

export function detectMergeConflicts(
  baseContent: string,
  currentContent: string,
  incomingContent: string
): ConflictMarker[] {
  console.log('Detecting merge conflicts between versions');
  
  const conflicts: ConflictMarker[] = [];
  const baseDiff = Diff.diffLines(baseContent, currentContent);
  const incomingDiff = Diff.diffLines(baseContent, incomingContent);

  let lineNumber = 1;
  baseDiff.forEach((part, index) => {
    if (part.added && incomingDiff[index]?.added) {
      conflicts.push({
        start: lineNumber,
        end: lineNumber + part.count! - 1,
        content: part.value,
        type: 'current'
      });
      
      conflicts.push({
        start: lineNumber,
        end: lineNumber + incomingDiff[index].count! - 1,
        content: incomingDiff[index].value,
        type: 'incoming'
      });
    }
    lineNumber += part.count || 0;
  });

  console.log('Detected conflicts:', conflicts);
  return conflicts;
}

export function resolveConflict(
  conflict: MergeConflict,
  resolution: 'current' | 'incoming' | 'both'
): string {
  console.log('Resolving conflict with strategy:', resolution);
  
  switch (resolution) {
    case 'current':
      return conflict.currentContent;
    case 'incoming':
      return conflict.incomingContent;
    case 'both':
      // Attempt to combine both changes
      const combinedDiff = Diff.diffLines(conflict.baseContent, conflict.currentContent);
      return combinedDiff.reduce((acc, part) => {
        if (!part.removed) {
          return acc + part.value;
        }
        return acc;
      }, '');
  }
}

export async function applyResolution(
  file: FileNode,
  resolvedContent: string
): Promise<void> {
  console.log('Applying resolution to file:', file.path);
  
  // Here we would update the file content in the database
  // This will be implemented when we add the database integration
  return Promise.resolve();
}