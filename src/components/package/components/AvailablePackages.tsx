import { ScrollArea } from "@/components/ui/scroll-area";
import { Package } from "../types";

interface AvailablePackagesProps {
  packages: Package[];
  selectedPackage: string | null;
  onSelect: (packageName: string) => void;
}

export function AvailablePackages({ 
  packages, 
  selectedPackage, 
  onSelect 
}: AvailablePackagesProps) {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-semibold mb-2">Available Packages</h3>
      <ScrollArea className="h-[400px]">
        <div className="space-y-2">
          {packages.map((pkg) => (
            <div
              key={pkg.name}
              className={`p-2 rounded cursor-pointer hover:bg-accent ${
                selectedPackage === pkg.name ? 'bg-accent' : ''
              }`}
              onClick={() => onSelect(pkg.name)}
            >
              <div className="font-medium">{pkg.name}</div>
              <div className="text-sm text-muted-foreground">{pkg.version}</div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}