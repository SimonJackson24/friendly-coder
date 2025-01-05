import { ScrollArea } from "@/components/ui/scroll-area";
import { DiffLine } from "./DiffLine";
import { DiffHeader } from "./DiffHeader";
import { DiffStats } from "./DiffStats";
import { useState, useEffect } from "react";
import * as Diff from 'diff';

interface DiffViewerProps {
  oldContent: any;
  newContent: any;
  oldVersion?: string;
  newVersion?: string;
  hasConflicts?: boolean;
  onResolveConflict?: (resolvedContent: string) => void;
  onLineClick?: (lineNumber: number) => void; // Added this prop
}

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged' | 'conflict';
  content: string;
  lineNumber: number;
  oldLineNumber?: number;
  newLineNumber?: number;
}

export function DiffViewer({
  oldContent,
  newContent,
  oldVersion,
  newVersion,
  hasConflicts,
  onResolveConflict,
  onLineClick
}: DiffViewerProps) {
  const [selectedLines, setSelectedLines] = useState<Set<number>>(new Set());
  const [currentConflictIndex, setCurrentConflictIndex] = useState(0);
  const [diffLines, setDiffLines] = useState<DiffLine[]>([]);
  const [stats, setStats] = useState({ additions: 0, deletions: 0, total: 0 });

  useEffect(() => {
    const oldString = typeof oldContent === 'string' ? oldContent : JSON.stringify(oldContent, null, 2);
    const newString = typeof newContent === 'string' ? newContent : JSON.stringify(newContent, null, 2);
    
    const diff = Diff.diffLines(oldString, newString);
    const lines: DiffLine[] = [];
    let oldLineNumber = 1;
    let newLineNumber = 1;
    let additions = 0;
    let deletions = 0;

    diff.forEach((part) => {
      const partLines = part.value.split('\n');
      if (partLines[partLines.length - 1] === '') {
        partLines.pop();
      }

      partLines.forEach((line) => {
        if (part.added) {
          additions++;
          lines.push({
            type: hasConflicts ? 'conflict' : 'added',
            content: line,
            lineNumber: newLineNumber,
            newLineNumber: newLineNumber++
          });
        } else if (part.removed) {
          deletions++;
          lines.push({
            type: hasConflicts ? 'conflict' : 'removed',
            content: line,
            lineNumber: oldLineNumber,
            oldLineNumber: oldLineNumber++
          });
        } else {
          lines.push({
            type: 'unchanged',
            content: line,
            lineNumber: newLineNumber,
            oldLineNumber: oldLineNumber++,
            newLineNumber: newLineNumber++
          });
        }
      });
    });

    setDiffLines(lines);
    setStats({ additions, deletions, total: additions + deletions });
  }, [oldContent, newContent, hasConflicts]);

  const handleLineClick = (lineNumber: number) => {
    if (!hasConflicts && onLineClick) {
      onLineClick(lineNumber);
      return;
    }
    
    if (!hasConflicts) return;
    
    const newSelected = new Set(selectedLines);
    if (newSelected.has(lineNumber)) {
      newSelected.delete(lineNumber);
    } else {
      newSelected.add(lineNumber);
    }
    setSelectedLines(newSelected);
  };

  const navigateConflict = (direction: 'next' | 'prev') => {
    const conflictIndices = diffLines
      .map((line, index) => line.type === 'conflict' ? index : -1)
      .filter(index => index !== -1);

    if (direction === 'next') {
      const nextIndex = conflictIndices.find(index => index > currentConflictIndex);
      if (nextIndex !== undefined) {
        setCurrentConflictIndex(nextIndex);
      }
    } else {
      const prevIndex = [...conflictIndices].reverse().find(index => index < currentConflictIndex);
      if (prevIndex !== undefined) {
        setCurrentConflictIndex(prevIndex);
      }
    }
  };

  return (
    <div className="space-y-4">
      {oldVersion && newVersion && (
        <DiffHeader
          oldVersion={oldVersion}
          newVersion={newVersion}
          onNavigatePrev={() => navigateConflict('prev')}
          onNavigateNext={() => navigateConflict('next')}
        />
      )}

      <DiffStats {...stats} />

      <ScrollArea className="h-[400px] w-full font-mono text-sm">
        <div className="space-y-1">
          {diffLines.map((line, i) => (
            <DiffLine
              key={i}
              {...line}
              isSelected={selectedLines.has(line.lineNumber)}
              currentConflict={i === currentConflictIndex}
              onClick={() => handleLineClick(line.lineNumber)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
