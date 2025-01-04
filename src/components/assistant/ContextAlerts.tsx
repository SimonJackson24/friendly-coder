import { AlertTriangle, Package, Database, FileCode } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ContextAlertsProps {
  context: {
    buildErrorCount: number;
    schemaChangeCount: number;
    packageOperationCount: number;
    fileOperationCount: number;
  };
}

export function ContextAlerts({ context }: ContextAlertsProps) {
  const hasRecentIssues = context.buildErrorCount > 0 || 
                         context.schemaChangeCount > 0 || 
                         context.packageOperationCount > 0;

  if (!hasRecentIssues) return null;

  return (
    <div className="space-y-2 p-4">
      {context.buildErrorCount > 0 && (
        <Alert variant="destructive" className="animate-fade-in">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Build Errors</AlertTitle>
          <AlertDescription>
            There are {context.buildErrorCount} recent build errors that might affect the AI's responses.
          </AlertDescription>
        </Alert>
      )}
      
      {context.schemaChangeCount > 0 && (
        <Alert className="animate-fade-in">
          <Database className="h-4 w-4" />
          <AlertTitle>Schema Changes</AlertTitle>
          <AlertDescription>
            {context.schemaChangeCount} recent database schema changes detected.
          </AlertDescription>
        </Alert>
      )}
      
      {context.packageOperationCount > 0 && (
        <Alert className="animate-fade-in">
          <Package className="h-4 w-4" />
          <AlertTitle>Package Changes</AlertTitle>
          <AlertDescription>
            {context.packageOperationCount} recent package operations performed.
          </AlertDescription>
        </Alert>
      )}

      {context.fileOperationCount > 0 && (
        <Alert className="animate-fade-in">
          <FileCode className="h-4 w-4" />
          <AlertTitle>File System Changes</AlertTitle>
          <AlertDescription>
            {context.fileOperationCount} recent file operations performed.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}