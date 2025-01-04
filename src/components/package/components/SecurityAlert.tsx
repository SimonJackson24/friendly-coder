import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface SecurityAlertProps {
  issuesCount: number;
}

export function SecurityAlert({ issuesCount }: SecurityAlertProps) {
  if (!issuesCount) return null;

  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Security Issues Found</AlertTitle>
      <AlertDescription>
        {issuesCount} security vulnerabilities detected in your dependencies.
      </AlertDescription>
    </Alert>
  );
}