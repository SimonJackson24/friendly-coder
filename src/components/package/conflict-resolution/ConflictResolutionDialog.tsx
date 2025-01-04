import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import type { DependencyConflict, ConflictResolutionStrategy } from "./types";

interface ConflictResolutionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  conflict: DependencyConflict;
  onResolve: (strategy: ConflictResolutionStrategy) => void;
}

export function ConflictResolutionDialog({
  isOpen,
  onClose,
  conflict,
  onResolve
}: ConflictResolutionDialogProps) {
  const [selectedStrategy, setSelectedStrategy] = useState<string>(
    conflict.suggestedStrategies[0]?.id
  );

  const handleResolve = () => {
    const strategy = conflict.suggestedStrategies.find(s => s.id === selectedStrategy);
    if (strategy) {
      onResolve(strategy);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Resolve Dependency Conflict</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Alert variant="warning">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Conflict detected for {conflict.packageName}: requires {conflict.requiredVersion} 
              but {conflict.currentVersion} is installed
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <h4 className="font-medium">Required by:</h4>
            <ul className="list-disc pl-4 space-y-1">
              {conflict.requiredBy.map((dep, i) => (
                <li key={i} className="text-sm text-muted-foreground">{dep}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Resolution Strategies:</h4>
            <RadioGroup
              value={selectedStrategy}
              onValueChange={setSelectedStrategy}
              className="space-y-2"
            >
              {conflict.suggestedStrategies.map((strategy) => (
                <div key={strategy.id} className="flex items-start space-x-3 p-2 rounded hover:bg-accent">
                  <RadioGroupItem value={strategy.id} id={strategy.id} />
                  <div className="space-y-1">
                    <Label htmlFor={strategy.id} className="font-medium">
                      {strategy.name}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {strategy.description}
                    </p>
                    <div className={`text-xs px-2 py-1 rounded-full inline-block
                      ${strategy.risk === 'low' ? 'bg-green-100 text-green-800' :
                        strategy.risk === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'}`}>
                      {strategy.risk} risk
                    </div>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleResolve}>
              Apply Resolution
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}