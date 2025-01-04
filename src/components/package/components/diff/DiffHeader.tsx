import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";

interface DiffHeaderProps {
  oldVersion: string;
  newVersion: string;
  onNavigatePrev?: () => void;
  onNavigateNext?: () => void;
}

export function DiffHeader({ 
  oldVersion, 
  newVersion,
  onNavigatePrev,
  onNavigateNext 
}: DiffHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">v{oldVersion}</span>
        <span className="text-sm text-muted-foreground">→</span>
        <span className="text-sm text-muted-foreground">v{newVersion}</span>
      </div>
      {(onNavigatePrev || onNavigateNext) && (
        <div className="flex items-center gap-2">
          {onNavigatePrev && (
            <Button
              size="sm"
              variant="outline"
              onClick={onNavigatePrev}
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          )}
          {onNavigateNext && (
            <Button
              size="sm"
              variant="outline"
              onClick={onNavigateNext}
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}