import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import * as Diff from 'diff';
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, X, AlertTriangle, ArrowUp, ArrowDown } from "lucide-react";
import { Progress } from "@/components/ui/progress";

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
  const [currentConflictIndex, setCurrentConflictIndex] = useState(0);
  const { toast } = useToast();

  // Generate diff using the diff library
  const diff = Diff.diffLines(oldContent, newContent);
  
  // Convert diff to lines with line numbers
  const lines: DiffLine[] = [];
  let oldLineNumber = 1;
  let newLineNumber = 1;

  diff.forEach((part) => {
    const partLines = part.value.split('\n');
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

  const conflictLines = lines.filter(line => line.type === 'conflict');
  const totalConflicts = conflictLines.length;
  const progress = totalConflicts > 0 ? (selectedLines.size / totalConflicts) * 100 : 0;

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

    if (selectedLines.size === 0) {
      toast({
        title: "No lines selected",
        description: "Please select at least one line to resolve the conflict",
        variant: "destructive",
      });
      return;
    }

    const resolvedContent = lines
      .filter(line => line.type !== 'conflict' || selectedLines.has(line.lineNumber))
      .map(line => line.content)
      .join('\n');

    onResolveConflict(resolvedContent);
    setSelectedLines(new Set());
  };

  const navigateConflict = (direction: 'next' | 'prev') => {
    const conflictIndices = lines
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
      {hasConflicts && (
        <div className="bg-yellow-500/10 p-4 rounded-lg mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <h3 className="text-yellow-500 font-semibold">Merge Conflicts Detected</h3>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigateConflict('prev')}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigateConflict('next')}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">
            Click on the lines you want to keep in the final version. Navigate through conflicts using the arrows.
          </p>
          
          <Progress value={progress} className="mb-4" />
          
          <div className="flex gap-2">
            <Button
              onClick={handleResolveConflict}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={selectedLines.size === 0}
            >
              <Check className="h-4 w-4 mr-2" />
              Resolve Conflicts
            </Button>
            <Button
              variant="outline"
              onClick={() => setSelectedLines(new Set())}
              disabled={selectedLines.size === 0}
            >
              <X className="h-4 w-4 mr-2" />
              Clear Selection
            </Button>
          </div>
        </div>
      )}
      <ScrollArea className={cn("h-[400px] w-full font-mono text-sm", className)}>
        <div className="space-y-1">
          {lines.map((line, i) => (
            <div
              key={i}
              onClick={() => handleLineClick(line.lineNumber)}
              className={cn(
                "grid grid-cols-[50px_50px_1fr] gap-2 cursor-pointer p-1 transition-colors",
                line.type === 'added' && "bg-green-500/10 hover:bg-green-500/20",
                line.type === 'removed' && "bg-red-500/10 hover:bg-red-500/20",
                line.type === 'conflict' && "bg-yellow-500/10 hover:bg-yellow-500/20",
                selectedLines.has(line.lineNumber) && "border-l-4 border-primary bg-accent",
                i === currentConflictIndex && "ring-2 ring-yellow-500/50"
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