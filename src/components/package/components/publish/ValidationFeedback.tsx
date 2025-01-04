import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, CheckCircle, PackageSearch, Info } from "lucide-react";
import { PublishValidation } from "../../types";

interface ValidationFeedbackProps {
  validation: PublishValidation | null;
}

export function ValidationFeedback({ validation }: ValidationFeedbackProps) {
  if (!validation) return null;

  const hasWarnings = validation.warnings?.length > 0;
  const hasDependencyIssues = validation.dependencyChecks?.some(
    dep => !dep.isCompatible
  );

  return (
    <ScrollArea className="h-[300px] w-full rounded-md border p-4">
      {!validation.isValid && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Validation Failed</AlertTitle>
          <AlertDescription>
            Please fix the following issues before publishing:
          </AlertDescription>
        </Alert>
      )}

      {validation.errors.map((error, i) => (
        <Alert key={`error-${i}`} variant="destructive" className="mb-2">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ))}

      {hasWarnings && (
        <Alert variant="warning" className="mb-4">
          <Info className="h-4 w-4" />
          <AlertTitle>Warnings</AlertTitle>
          <AlertDescription>
            The following issues were detected but won't prevent publishing:
          </AlertDescription>
        </Alert>
      )}

      {validation.warnings?.map((warning, i) => (
        <Alert key={`warning-${i}`} variant="warning" className="mb-2">
          <Info className="h-4 w-4" />
          <AlertDescription>{warning}</AlertDescription>
        </Alert>
      ))}

      {hasDependencyIssues && (
        <Alert variant="destructive" className="mb-4">
          <PackageSearch className="h-4 w-4" />
          <AlertTitle>Dependency Conflicts</AlertTitle>
          <AlertDescription>
            Conflicts were detected in package dependencies:
          </AlertDescription>
        </Alert>
      )}

      {validation.dependencyChecks?.map((dep, i) => (
        <Alert
          key={`dep-${i}`}
          variant={dep.isCompatible ? "default" : "destructive"}
          className="mb-2"
        >
          {dep.isCompatible ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <AlertTriangle className="h-4 w-4" />
          )}
          <AlertTitle>{dep.name}@{dep.version}</AlertTitle>
          {!dep.isCompatible && (
            <AlertDescription>
              <div className="mt-2 space-y-1">
                <p>Conflicts with: {dep.conflicts.join(", ")}</p>
                <p>Required by: {dep.requiredBy.join(", ")}</p>
                {dep.suggestedVersion && (
                  <p className="text-yellow-600 dark:text-yellow-400">
                    Suggested version: {dep.suggestedVersion}
                  </p>
                )}
              </div>
            </AlertDescription>
          )}
        </Alert>
      ))}

      {validation.breakingChanges?.length > 0 && (
        <div className="mt-4">
          <Alert variant="warning">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Breaking Changes Detected</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-4 mt-2">
                {validation.breakingChanges.map((change, i) => (
                  <li key={i}>{change}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      )}
    </ScrollArea>
  );
}