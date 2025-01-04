import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Check, Loader2, X } from "lucide-react";
import { PublishStep } from "../../types";

interface PublishStepsProps {
  steps: PublishStep[];
  onComplete: () => void;
  onCancel: () => void;
}

export function PublishSteps({ steps, onComplete, onCancel }: PublishStepsProps) {
  const isCompleted = steps.every((step) => step.status === 'completed');
  const hasError = steps.some((step) => step.status === 'error');

  return (
    <div className="space-y-4">
      {steps.map((step) => (
        <Alert
          key={step.id}
          variant={step.status === 'error' ? 'destructive' : 'default'}
          className="flex items-center"
        >
          <div className="flex items-center gap-2">
            {step.status === 'pending' && (
              <div className="w-4 h-4 rounded-full bg-gray-200" />
            )}
            {step.status === 'in_progress' && (
              <Loader2 className="w-4 h-4 animate-spin" />
            )}
            {step.status === 'completed' && (
              <Check className="w-4 h-4 text-green-500" />
            )}
            {step.status === 'error' && (
              <X className="w-4 h-4 text-red-500" />
            )}
            <AlertTitle>{step.title}</AlertTitle>
          </div>
          <AlertDescription>
            {step.description}
            {step.error && (
              <p className="text-red-500 mt-2">{step.error}</p>
            )}
          </AlertDescription>
        </Alert>
      ))}

      <div className="flex justify-end gap-2 mt-4">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={!hasError && steps.some(s => s.status === 'in_progress')}
        >
          Cancel
        </Button>
        <Button
          onClick={onComplete}
          disabled={!isCompleted}
        >
          Complete
        </Button>
      </div>
    </div>
  );
}