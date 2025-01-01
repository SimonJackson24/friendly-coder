import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

interface ConsoleProps {
  logs: string[];
  errors: string[];
}

export function Console({ logs, errors }: ConsoleProps) {
  return (
    <Card className="p-4">
      <ScrollArea className="h-[600px]">
        {errors.map((error, index) => (
          <div key={`error-${index}`} className="text-red-500 mb-2">
            {error}
          </div>
        ))}
        {logs.map((log, index) => (
          <div key={`log-${index}`} className="mb-2">
            {log}
          </div>
        ))}
      </ScrollArea>
    </Card>
  );
}