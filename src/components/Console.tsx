/**
 * Copyright (c) 2024 AI Studio. All rights reserved.
 * 
 * This file is part of the proprietary software developed by the copyright holder.
 * 
 * This software uses the following open source packages under their respective licenses:
 * - shadcn/ui components: MIT License (https://github.com/shadcn/ui/blob/main/LICENSE.md)
 * - Lucide Icons: MIT License (https://github.com/lucide-icons/lucide/blob/main/LICENSE)
 * 
 * While these dependencies are open source, this file and its contents remain proprietary
 * and may not be copied, modified, or distributed without explicit permission.
 */

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ConsoleProps {
  logs: string[];
  errors: string[];
  onClear: () => void;
}

export function Console({ logs, errors, onClear }: ConsoleProps) {
  useEffect(() => {
    const consoleElement = document.getElementById("console");
    if (consoleElement) {
      consoleElement.scrollTop = consoleElement.scrollHeight;
    }
  }, [logs, errors]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div id="console" className="p-4 space-y-2">
            {logs.map((log, index) => (
              <div key={index} className="text-gray-200">
                {log}
              </div>
            ))}
            {errors.map((error, index) => (
              <div key={index} className="text-red-500">
                {error}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
      <div className="p-4">
        <Button onClick={onClear} variant="outline" className="w-full">
          Clear Console
        </Button>
      </div>
    </div>
  );
}
