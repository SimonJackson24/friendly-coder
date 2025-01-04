import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { PublishValidation } from "../../types";

interface ValidationFeedbackProps {
  validation: PublishValidation | null;
}

export function ValidationFeedback({ validation }: ValidationFeedbackProps) {
  if (!validation) return null;

  return (
    <div className="space-y-3">
      {!validation.isValid && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Validation Failed</AlertTitle>
          <AlertDescription>
            Please fix the following issues before publishing:
          </AlertDescription>
        </Alert>
      )}

      {validation.errors.map((error, i) => (
        <Alert key={`error-${i}`} variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ))}

      {validation.warnings.map((warning, i) => (
        <Alert key={`warning-${i}`} variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{warning}</AlertDescription>
        </Alert>
      ))}

      {validation.dependencyChecks.map((dep, i) => (
        <Alert 
          key={`dep-${i}`} 
          variant={dep.isCompatible ? "default" : "destructive"}
        >
          {dep.isCompatible ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <AlertTriangle className="h-4 w-4" />
          )}
          <AlertTitle>{dep.name}@{dep.version}</AlertTitle>
          {!dep.isCompatible && (
            <AlertDescription>
              <div>Conflicts: {dep.conflicts.join(", ")}</div>
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