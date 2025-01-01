import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

interface ConsoleProps {
  logs: string[];
  errors: string[];
  onClear?: () => void;
}

export function Console({ logs, errors, onClear }: ConsoleProps) {
  return (
    <Card className="relative">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="font-semibold">Console Output</h3>
        {onClear && (
          <Button variant="ghost" size="sm" onClick={onClear}>
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <ScrollArea className="h-[600px] p-4">
        {errors.map((error, index) => (
          <div key={`error-${index}`} className="text-red-500 font-mono mb-2">
            [Error] {error}
          </div>
        ))}
        {logs.map((log, index) => (
          <div key={`log-${index}`} className="font-mono mb-2">
            {log}
          </div>
        ))}
      </ScrollArea>
    </Card>
  );
}