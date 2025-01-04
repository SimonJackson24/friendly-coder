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
    <div className="space-y-2 p-4 animate-fade-in">
      {context.buildErrorCount > 0 && (
        <Alert variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20 animate-slide-in-right">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="font-semibold">Build Errors</AlertTitle>
          <AlertDescription>
            There are {context.buildErrorCount} recent build errors that might affect the AI's responses.
          </AlertDescription>
        </Alert>
      )}
      
      {context.schemaChangeCount > 0 && (
        <Alert className="bg-primary/5 border-primary/20 animate-slide-in-right">
          <Database className="h-4 w-4 text-primary" />
          <AlertTitle className="font-semibold">Schema Changes</AlertTitle>
          <AlertDescription>
            {context.schemaChangeCount} recent database schema changes detected.
          </AlertDescription>
        </Alert>
      )}
      
      {context.packageOperationCount > 0 && (
        <Alert className="bg-primary/5 border-primary/20 animate-slide-in-right">
          <Package className="h-4 w-4 text-primary" />
          <AlertTitle className="font-semibold">Package Changes</AlertTitle>
          <AlertDescription>
            {context.packageOperationCount} recent package operations performed.
          </AlertDescription>
        </Alert>
      )}

      {context.fileOperationCount > 0 && (
        <Alert className="bg-primary/5 border-primary/20 animate-slide-in-right">
          <FileCode className="h-4 w-4 text-primary" />
          <AlertTitle className="font-semibold">File System Changes</AlertTitle>
          <AlertDescription>
            {context.fileOperationCount} recent file operations performed.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}