import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Package } from "../types";

interface PackageListProps {
  packages: Package[];
  onUninstall: (packageName: string) => void;
}

export function PackageList({ packages, onUninstall }: PackageListProps) {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-semibold mb-2">Installed Packages</h3>
      <ScrollArea className="h-[400px]">
        <div className="space-y-2">
          {packages.map((pkg) => (
            <div key={pkg.name} className="flex items-center justify-between p-2 rounded hover:bg-accent">
              <div>
                <div className="font-medium">{pkg.name}</div>
                <div className="text-sm text-muted-foreground">{pkg.version}</div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onUninstall(pkg.name)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}