import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Search, Plus, Trash2, RefreshCw, AlertTriangle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useProject } from "@/contexts/ProjectContext";

interface Package {
  name: string;
  version: string;
  description?: string;
}

export function PackageManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [installedPackages, setInstalledPackages] = useState<Package[]>([]);
  const [availablePackages, setAvailablePackages] = useState<Package[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const { selectedProject } = useProject();
  const { toast } = useToast();

  useEffect(() => {
    if (selectedProject) {
      fetchPackages();
    }
  }, [selectedProject]);

  const fetchPackages = async () => {
    if (!selectedProject) {
      toast({
        title: "No project selected",
        description: "Please select a project to analyze packages.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Fetching packages for project:', selectedProject.id);
      
      // Mock package.json data for testing
      const mockPackageJson = {
        dependencies: {
          "react": "^18.2.0",
          "react-dom": "^18.2.0"
        },
        devDependencies: {
          "typescript": "^4.9.3",
          "vite": "^4.1.0"
        }
      };

      const { data: packageData, error } = await supabase.functions.invoke('project-operations', {
        body: { 
          operation: 'analyze-dependencies',
          data: { 
            projectId: selectedProject.id,
            packageData: mockPackageJson
          }
        }
      });

      if (error) throw error;

      console.log('Analysis results:', packageData);
      setAnalysisResults(packageData);
      
      // Update installed packages list based on the mock data
      const installed = [
        ...Object.entries(mockPackageJson.dependencies).map(([name, version]) => ({
          name,
          version: version as string
        })),
        ...Object.entries(mockPackageJson.devDependencies).map(([name, version]) => ({
          name,
          version: version as string
        }))
      ];
      
      setInstalledPackages(installed);
      
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast({
        title: "Error",
        description: "Failed to fetch packages",
        variant: "destructive",
      });
    }
  };

  const handleInstall = async () => {
    if (!selectedPackage) return;
    
    toast({
      title: "Installing Package",
      description: `Installing ${selectedPackage}...`,
    });
    
    try {
      // Implement package installation logic
      await supabase.functions.invoke('project-operations', {
        body: { 
          operation: 'install-package',
          data: { packageName: selectedPackage }
        }
      });

      toast({
        title: "Success",
        description: `Package ${selectedPackage} installed successfully`,
      });

      fetchPackages(); // Refresh package list
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
      // Implement package uninstallation logic
      await supabase.functions.invoke('project-operations', {
        body: { 
          operation: 'uninstall-package',
          data: { packageName }
        }
      });

      toast({
        title: "Success",
        description: `Package ${packageName} uninstalled successfully`,
      });

      fetchPackages(); // Refresh package list
    } catch (error) {
      console.error('Error uninstalling package:', error);
      toast({
        title: "Error",
        description: "Failed to uninstall package",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Package Manager</h2>
        <Button onClick={fetchPackages} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {analysisResults?.securityIssues?.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Security Issues Found</AlertTitle>
          <AlertDescription>
            {analysisResults.securityIssues.length} security vulnerabilities detected in your dependencies.
          </AlertDescription>
        </Alert>
      )}
      
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
              {availablePackages.map((pkg) => (
                <div
                  key={pkg.name}
                  className={`p-2 rounded cursor-pointer hover:bg-accent ${
                    selectedPackage === pkg.name ? 'bg-accent' : ''
                  }`}
                  onClick={() => setSelectedPackage(pkg.name)}
                >
                  <div className="font-medium">{pkg.name}</div>
                  <div className="text-sm text-muted-foreground">{pkg.version}</div>
                </div>
              ))}
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
                    <div className="text-sm text-muted-foreground">{pkg.version}</div>
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