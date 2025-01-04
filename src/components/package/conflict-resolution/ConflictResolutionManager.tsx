import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ConflictResolutionDialog } from "./ConflictResolutionDialog";
import type { DependencyConflict, ConflictResolutionStrategy } from "./types";
import { AlertTriangle, Check } from "lucide-react";

interface ConflictResolutionManagerProps {
  conflicts: DependencyConflict[];
  onResolveAll: (resolutions: Record<string, ConflictResolutionStrategy>) => void;
}

export function ConflictResolutionManager({
  conflicts,
  onResolveAll
}: ConflictResolutionManagerProps) {
  const [resolutions, setResolutions] = useState<Record<string, ConflictResolutionStrategy>>({});
  const [currentConflict, setCurrentConflict] = useState<DependencyConflict | null>(null);

  const handleResolve = (conflict: DependencyConflict, strategy: ConflictResolutionStrategy) => {
    const newResolutions = {
      ...resolutions,
      [conflict.packageName]: strategy
    };
    setResolutions(newResolutions);

    if (Object.keys(newResolutions).length === conflicts.length) {
      onResolveAll(newResolutions);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Dependency Conflicts</h3>
        <span className="text-sm text-muted-foreground">
          {Object.keys(resolutions).length} of {conflicts.length} resolved
        </span>
      </div>

      <ScrollArea className="h-[400px] rounded-md border">
        <div className="p-4 space-y-2">
          {conflicts.map((conflict) => {
            const isResolved = resolutions[conflict.packageName];
            return (
              <div
                key={conflict.packageName}
                className="flex items-center justify-between p-3 rounded-lg border bg-card"
              >
                <div className="space-y-1">
                  <div className="font-medium">{conflict.packageName}</div>
                  <div className="text-sm text-muted-foreground">
                    Required: {conflict.requiredVersion} | Current: {conflict.currentVersion}
                  </div>
                </div>
                
                {isResolved ? (
                  <div className="flex items-center text-green-600">
                    <Check className="h-4 w-4 mr-2" />
                    <span className="text-sm">Resolved</span>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentConflict(conflict)}
                  >
                    <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
                    Resolve
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {currentConflict && (
        <ConflictResolutionDialog
          isOpen={true}
          onClose={() => setCurrentConflict(null)}
          conflict={currentConflict}
          onResolve={(strategy) => handleResolve(currentConflict, strategy)}
        />
      )}
    </div>
  );
}