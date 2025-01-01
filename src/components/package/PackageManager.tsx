import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Search, Plus, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function PackageManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleInstall = async () => {
    if (!selectedPackage) return;
    
    toast({
      title: "Installing Package",
      description: `Installing ${selectedPackage}...`,
    });
    
    // Package installation logic will be implemented here
  };

  const handleUninstall = async (packageName: string) => {
    toast({
      title: "Uninstalling Package",
      description: `Uninstalling ${packageName}...`,
    });
    
    // Package uninstallation logic will be implemented here
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Package Manager</h2>
      
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search packages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button onClick={handleInstall} disabled={!selectedPackage}>
          <Plus className="w-4 h-4 mr-2" />
          Install
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Available Packages</h3>
          <ScrollArea className="h-[400px]">
            {/* Package list will be populated here */}
          </ScrollArea>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Installed Packages</h3>
          <ScrollArea className="h-[400px]">
            {/* Installed packages will be shown here */}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}