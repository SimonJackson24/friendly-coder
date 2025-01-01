import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Search, Plus, Trash2, RefreshCw, AlertTriangle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useQuery } from "@tanstack/react-query";

interface Package {
  name: string;
  version: string;
  description?: string;
}

interface PackageManagerProps {
  projectId: string;
}

export function PackageManager({ projectId }: PackageManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: projectData, isLoading } = useQuery({
    queryKey: ["project-packages", projectId],
    queryFn: async () => {
      console.log("Fetching project packages:", projectId);
      const { data: files, error } = await supabase
        .from("files")
        .select("*")
        .eq("project_id", projectId)
        .eq("name", "package.json")
        .single();

      if (error) {
        console.error("Error fetching package.json:", error);
        throw error;
      }

      if (!files?.content) {
        return { dependencies: {}, devDependencies: {} };
      }

      return JSON.parse(files.content);
    },
  });

  const installedPackages = projectData ? [
    ...Object.entries(projectData.dependencies || {}).map(([name, version]) => ({
      name,
      version: version as string,
      type: "dependency"
    })),
    ...Object.entries(projectData.devDependencies || {}).map(([name, version]) => ({
      name,
      version: version as string,
      type: "devDependency"
    }))
  ] : [];

  const handleInstall = async () => {
    if (!selectedPackage) return;
    
    toast({
      title: "Installing Package",
      description: `Installing ${selectedPackage}...`,
    });
    
    try {
      await supabase.functions.invoke('project-operations', {
        body: { 
          operation: 'install-package',
          projectId,
          data: { packageName: selectedPackage }
        }
      });

      toast({
        title: "Success",
        description: `Package ${selectedPackage} installed successfully`,
      });
    } catch (error) {
      console.error('Error installing package:', error);
      toast({
        title: "Error",
        description: "Failed to install package",
        variant: "destructive",
      });
    }
  };

  const handleUninstall = async (packageName: string) => {
    toast({
      title: "Uninstalling Package",
      description: `Uninstalling ${packageName}...`,
    });
    
    try {
      await supabase.functions.invoke('project-operations', {
        body: { 
          operation: 'uninstall-package',
          projectId,
          data: { packageName }
        }
      });

      toast({
        title: "Success",
        description: `Package ${packageName} uninstalled successfully`,
      });
    } catch (error) {
      console.error('Error uninstalling package:', error);
      toast({
        title: "Error",
        description: "Failed to uninstall package",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading project packages...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Package Manager</h2>
        <Button onClick={() => window.location.reload()} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

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
            <div className="space-y-2">
              {/* This would be populated with npm registry search results */}
            </div>
          </ScrollArea>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Installed Packages</h3>
          <ScrollArea className="h-[400px]">
            <div className="space-y-2">
              {installedPackages.map((pkg) => (
                <div key={pkg.name} className="flex items-center justify-between p-2 rounded hover:bg-accent">
                  <div>
                    <div className="font-medium">{pkg.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {pkg.version} ({pkg.type})
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUninstall(pkg.name)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}