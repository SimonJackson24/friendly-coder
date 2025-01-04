import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface FileDiffViewerProps {
  oldContent: string;
  newContent: string;
  className?: string;
}

export function FileDiffViewer({ oldContent, newContent, className }: FileDiffViewerProps) {
  const oldLines = oldContent.split('\n');
  const newLines = newContent.split('\n');
  
  // Simple diff implementation - in a real app, you'd want to use a proper diff algorithm
  const diffs = newLines.map((line, i) => {
    if (i >= oldLines.length) return { type: 'added', content: line };
    if (line !== oldLines[i]) return { type: 'modified', content: line, oldContent: oldLines[i] };
    return { type: 'unchanged', content: line };
  });

  return (
    <ScrollArea className={cn("h-[400px] w-full", className)}>
      <div className="space-y-1 font-mono text-sm">
        {diffs.map((diff, i) => (
          <div
            key={i}
            className={cn(
              "px-4 py-1",
              diff.type === 'added' && "bg-green-500/10",
              diff.type === 'modified' && "bg-yellow-500/10"
            )}
          >
            <span className="select-none text-muted-foreground w-8 inline-block">
              {i + 1}
            </span>
            {diff.type === 'modified' ? (
              <>
                <div className="pl-8 text-red-500">- {diff.oldContent}</div>
                <div className="pl-8 text-green-500">+ {diff.content}</div>
              </>
            ) : (
              <span className="pl-8">{diff.content}</span>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}