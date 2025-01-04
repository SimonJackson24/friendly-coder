import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import * as Diff from 'diff';
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

interface FileDiffViewerProps {
  oldContent: string;
  newContent: string;
  className?: string;
  onResolveConflict?: (resolvedContent: string) => void;
  hasConflicts?: boolean;
}

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged' | 'conflict';
  content: string;
  lineNumber: number;
  oldLineNumber?: number;
  newLineNumber?: number;
}

export function FileDiffViewer({ 
  oldContent, 
  newContent, 
  className,
  onResolveConflict,
  hasConflicts 
}: FileDiffViewerProps) {
  const [selectedLines, setSelectedLines] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  // Generate diff using the diff library
  const diff = Diff.diffLines(oldContent, newContent);
  
  // Convert diff to lines with line numbers
  const lines: DiffLine[] = [];
  let oldLineNumber = 1;
  let newLineNumber = 1;

  diff.forEach((part) => {
    const partLines = part.value.split('\n');
    // Remove empty line at the end if present
    if (partLines[partLines.length - 1] === '') {
      partLines.pop();
    }

    partLines.forEach((line) => {
      if (part.added) {
        lines.push({
          type: hasConflicts ? 'conflict' : 'added',
          content: line,
          lineNumber: newLineNumber,
          newLineNumber: newLineNumber++
        });
      } else if (part.removed) {
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

  const handleLineClick = (lineNumber: number) => {
    if (!hasConflicts) return;
    
    const newSelected = new Set(selectedLines);
    if (newSelected.has(lineNumber)) {
      newSelected.delete(lineNumber);
    } else {
      newSelected.add(lineNumber);
    }
    setSelectedLines(newSelected);
  };

  const handleResolveConflict = () => {
    if (!onResolveConflict) return;

    const resolvedContent = lines
      .filter(line => line.type !== 'conflict' || selectedLines.has(line.lineNumber))
      .map(line => line.content)
      .join('\n');

    onResolveConflict(resolvedContent);
    toast({
      title: "Conflict Resolution",
      description: "Changes have been merged successfully",
    });
  };

  return (
    <div className="space-y-4">
      {hasConflicts && (
        <div className="bg-yellow-500/10 p-4 rounded-lg mb-4">
          <h3 className="text-yellow-500 font-semibold mb-2">Merge Conflicts Detected</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Click on the lines you want to keep in the final version.
          </p>
          <button
            onClick={handleResolveConflict}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
          >
            Resolve Conflicts
          </button>
        </div>
      )}
      <ScrollArea className={cn("h-[400px] w-full font-mono text-sm", className)}>
        <div className="space-y-1">
          {lines.map((line, i) => (
            <div
              key={i}
              onClick={() => handleLineClick(line.lineNumber)}
              className={cn(
                "grid grid-cols-[50px_50px_1fr] gap-2 cursor-pointer",
                line.type === 'added' && "bg-green-500/10",
                line.type === 'removed' && "bg-red-500/10",
                line.type === 'conflict' && "bg-yellow-500/10",
                selectedLines.has(line.lineNumber) && "border-2 border-primary"
              )}
            >
              <span className="select-none text-muted-foreground text-right pr-2">
                {line.oldLineNumber || ' '}
              </span>
              <span className="select-none text-muted-foreground text-right pr-2">
                {line.newLineNumber || ' '}
              </span>
              <span className={cn(
                "pl-2",
                line.type === 'added' && "text-green-500",
                line.type === 'removed' && "text-red-500",
                line.type === 'conflict' && "text-yellow-500"
              )}>
                {line.content || ' '}
              </span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}