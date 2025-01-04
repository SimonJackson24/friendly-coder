import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import * as Diff from 'diff';

interface FileDiffViewerProps {
  oldContent: string;
  newContent: string;
  className?: string;
}

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  content: string;
  lineNumber: number;
  oldLineNumber?: number;
  newLineNumber?: number;
}

export function FileDiffViewer({ oldContent, newContent, className }: FileDiffViewerProps) {
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
          type: 'added',
          content: line,
          lineNumber: newLineNumber,
          newLineNumber: newLineNumber++
        });
      } else if (part.removed) {
        lines.push({
          type: 'removed',
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

  return (
    <ScrollArea className={cn("h-[400px] w-full font-mono text-sm", className)}>
      <div className="space-y-1">
        {lines.map((line, i) => (
          <div
            key={i}
            className={cn(
              "grid grid-cols-[50px_50px_1fr] gap-2",
              line.type === 'added' && "bg-green-500/10",
              line.type === 'removed' && "bg-red-500/10"
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
              line.type === 'removed' && "text-red-500"
            )}>
              {line.content || ' '}
            </span>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}