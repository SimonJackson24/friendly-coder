import { DependencyCheck } from "../../types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Check, AlertTriangle, X } from "lucide-react";

interface ValidationSectionProps {
  dependencyChecks: DependencyCheck[];
  errors: string[];
  warnings: string[];
}

export function ValidationSection({ dependencyChecks, errors, warnings }: ValidationSectionProps) {
  return (
    <div className="space-y-4">
      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertTitle>Validation Errors</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-4">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {warnings.length > 0 && (
        <Alert variant="warning">
          <AlertTitle>Warnings</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-4">
              {warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {dependencyChecks.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold">Dependency Checks</h3>
          {dependencyChecks.map((check) => (
            <div
              key={check.name}
              className="flex items-center justify-between p-2 border rounded"
            >
              <div className="flex items-center gap-2">
                {check.compatible ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : check.suggestedVersion ? (
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                ) : (
                  <X className="w-4 h-4 text-red-500" />
                )}
                <span>
                  {check.name}@{check.version}
                </span>
              </div>
              {!check.compatible && check.suggestedVersion && (
                <span className="text-sm text-muted-foreground">
                  Suggested: {check.suggestedVersion}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}