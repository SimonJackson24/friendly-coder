import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Check, X } from "lucide-react";
import { PublishValidation } from "../../types";

interface ValidationSectionProps {
  validation: PublishValidation | null;
}

export function ValidationSection({ validation }: ValidationSectionProps) {
  if (!validation) return null;

  return (
    <div className="space-y-2">
      {validation.errors.map((error, i) => (
        <Alert key={i} variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ))}
      
      {validation.warnings.map((warning, i) => (
        <Alert key={i} variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>{warning}</AlertDescription>
        </Alert>
      ))}

      {validation.dependencies.map((dep, i) => (
        <Alert key={i} variant={dep.isCompatible ? "default" : "destructive"}>
          {dep.isCompatible ? (
            <Check className="h-4 w-4" />
          ) : (
            <X className="h-4 w-4" />
          )}
          <AlertTitle>{dep.name}@{dep.version}</AlertTitle>
          {!dep.isCompatible && (
            <AlertDescription>
              {dep.conflicts.join(", ")}
              {dep.suggestedVersion && (
                <div className="mt-2">
                  Suggested version: {dep.suggestedVersion}
                </div>
              )}
            </AlertDescription>
          )}
        </Alert>
      ))}
    </div>
  );
}