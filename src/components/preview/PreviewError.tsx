import { Alert, AlertDescription } from "@/components/ui/alert";

interface PreviewErrorProps {
  message: string;
}

export function PreviewError({ message }: PreviewErrorProps) {
  return (
    <Alert variant="destructive" className="m-4">
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}