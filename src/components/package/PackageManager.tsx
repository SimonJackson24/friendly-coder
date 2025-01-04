import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useProject } from "@/contexts/ProjectContext";
import { PackageSearch } from "./components/PackageSearch";
import { SecurityAlert } from "./components/SecurityAlert";
import { AvailablePackages } from "./components/AvailablePackages";
import { PackageList } from "./components/PackageList";
import { PublishPackage } from "./components/PublishPackage";
import { VersionHistory } from "./components/VersionHistory";
import { AccessControl } from "./components/AccessControl";
import { Package } from "./types";

export function PackageManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [installedPackages, setInstalledPackages] = useState<Package[]>([]);
  const [availablePackages, setAvailablePackages] = useState<Package[]>([]);
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
      
      const { data: packageData, error } = await supabase.functions.invoke('project-operations', {
        body: { 
          operation: 'analyze-dependencies',
          data: { projectId: selectedProject.id }
        }
      });

      if (error) throw error;

      console.log('Analysis results:', packageData);
      setAnalysisResults(packageData);
      
      // Update installed packages list with proper Package type mapping
      if (packageData?.dependencies) {
        const installed: Package[] = Object.entries(packageData.dependencies).map(([name, version]) => ({
          id: `${name}@${version}`, // Generate a unique ID
          name,
          version: version as string,
          description: '', // Default empty description
          is_private: false, // Default to public
          author_id: '', // Will be populated when needed
          package_data: {} // Default empty package data
        }));
        setInstalledPackages(installed);
      }
      
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

      fetchPackages();
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
          data: { packageName }
        }
      });

      toast({
        title: "Success",
        description: `Package ${packageName} uninstalled successfully`,
      });

      fetchPackages();
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

      <SecurityAlert 
        issuesCount={analysisResults?.securityIssues?.length || 0} 
      />
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <PackageSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedPackage={selectedPackage}
            onInstall={handleInstall}
          />

          <AvailablePackages
            packages={availablePackages}
            selectedPackage={selectedPackage}
            onSelect={setSelectedPackage}
          />

          <PublishPackage />
        </div>

        <div className="space-y-4">
          <PackageList
            packages={installedPackages}
            onUninstall={handleUninstall}
          />
          
          {selectedPackage && (
            <>
              <VersionHistory packageId={selectedPackage} />
              <AccessControl packageId={selectedPackage} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}