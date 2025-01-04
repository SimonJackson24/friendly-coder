import { Check, Loader2, XCircle } from "lucide-react";

interface BuildStep {
  id: string;
  step_name: string;
  status: string;
  error_message?: string;
}

interface BuildStepListProps {
  steps: BuildStep[];
}

export function BuildStepList({ steps }: BuildStepListProps) {
  const getStepIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <Check className="h-4 w-4 text-green-500" />;
      case "running":
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      {steps.map((step) => (
        <div
          key={step.id}
          className="flex items-center justify-between p-2 border rounded"
        >
          <div className="flex items-center gap-2">
            {getStepIcon(step.status)}
            <span>{step.step_name}</span>
          </div>
          {step.error_message && (
            <span className="text-sm text-red-500">{step.error_message}</span>
          )}
        </div>
      ))}
    </div>
  );
}