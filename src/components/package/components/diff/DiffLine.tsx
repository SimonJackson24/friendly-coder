import { cn } from "@/lib/utils";

interface DiffLineProps {
  type: 'added' | 'removed' | 'unchanged' | 'conflict';
  content: string;
  oldLineNumber?: number;
  newLineNumber?: number;
  isSelected?: boolean;
  onClick?: () => void;
  currentConflict?: boolean;
}

export function DiffLine({ 
  type, 
  content, 
  oldLineNumber, 
  newLineNumber,
  isSelected,
  onClick,
  currentConflict
}: DiffLineProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "grid grid-cols-[50px_50px_1fr] gap-2 cursor-pointer p-1 transition-colors",
        type === 'added' && "bg-green-500/10 hover:bg-green-500/20",
        type === 'removed' && "bg-red-500/10 hover:bg-red-500/20",
        type === 'conflict' && "bg-yellow-500/10 hover:bg-yellow-500/20",
        isSelected && "border-l-4 border-primary bg-accent",
        currentConflict && "ring-2 ring-yellow-500/50"
      )}
    >
      <span className="select-none text-muted-foreground text-right pr-2">
        {oldLineNumber || ' '}
      </span>
      <span className="select-none text-muted-foreground text-right pr-2">
        {newLineNumber || ' '}
      </span>
      <span className={cn(
        "pl-2",
        type === 'added' && "text-green-500",
        type === 'removed' && "text-red-500",
        type === 'conflict' && "text-yellow-500"
      )}>
        {content || ' '}
      </span>
    </div>
  );
}