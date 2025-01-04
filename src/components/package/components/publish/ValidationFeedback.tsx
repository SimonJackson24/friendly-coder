import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { DependencyCheck, PublishValidation } from "../../types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ValidationFeedbackProps {
  validation: PublishValidation;
}

export function ValidationFeedback({ validation }: ValidationFeedbackProps) {
  const getDependencyStatus = (dep: DependencyCheck) => {
    if (dep.compatible) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
  };

  if (!validation.valid) {
    return (
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertTitle>Validation Failed</AlertTitle>
        <AlertDescription>
          <ul className="list-disc pl-4">
            {validation.errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {validation.warnings.length > 0 && (
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Warnings</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-4">
              {validation.warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Dependency Checks</h3>
        {validation.dependencyChecks.map((dep) => (
          <div
            key={dep.name}
            className="flex items-center justify-between p-2 bg-background rounded border"
          >
            <div className="flex items-center gap-2">
              {getDependencyStatus(dep)}
              <span>
                {dep.name}@{dep.version}
              </span>
            </div>
            {!dep.compatible && dep.suggestedVersion && (
              <span className="text-sm text-muted-foreground">
                Suggested: {dep.suggestedVersion}
              </span>
            )}
          </div>
        ))}
      </div>

      {validation.breakingChanges.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Breaking Changes Detected</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-4">
              {validation.breakingChanges.map((change, index) => (
                <li key={index}>{change}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}