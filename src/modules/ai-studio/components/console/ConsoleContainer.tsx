import { Console } from "@/components/Console";

interface ConsoleContainerProps {
  logs: string[];
  errors: string[];
  onClear: () => void;
}

export function ConsoleContainer({ logs, errors, onClear }: ConsoleContainerProps) {
  return (
    <div className="h-full">
      <Console 
        logs={logs} 
        errors={errors}
        onClear={onClear} 
      />
    </div>
  );
}