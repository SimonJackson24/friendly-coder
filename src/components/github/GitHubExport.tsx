import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Globe, Lock, Loader2, GitFork } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface GitHubExportProps {
  onExportSuccess: (repoUrl: string) => void;
}

export function GitHubExport({ onExportSuccess }: GitHubExportProps) {
  const [repoName, setRepoName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [licenseType, setLicenseType] = useState("mit");
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    if (!repoName) {
      toast({
        title: "Error",
        description: "Please enter a repository name",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    try {
      const { data, error } = await supabase.functions.invoke('project-operations', {
        body: { 
          operation: 'github-export',
          data: { 
            repoName,
            isPrivate,
            licenseType,
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Project exported to GitHub successfully",
      });

      onExportSuccess(data.repository.html_url);
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Error",
        description: "Failed to export project to GitHub",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Alert>
        <AlertDescription>
          Export your project to a new GitHub repository with advanced configuration options.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="repo-name">Repository Name</Label>
          <Input
            id="repo-name"
            value={repoName}
            onChange={(e) => setRepoName(e.target.value)}
            placeholder="my-awesome-project"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Repository Visibility</Label>
            <div className="text-sm text-muted-foreground">
              {isPrivate ? 
                <span className="flex items-center gap-1"><Lock className="w-4 h-4" /> Private</span> : 
                <span className="flex items-center gap-1"><Globe className="w-4 h-4" /> Public</span>
              }
            </div>
          </div>
          <Switch
            checked={isPrivate}
            onCheckedChange={setIsPrivate}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="license">License Type</Label>
          <Select value={licenseType} onValueChange={setLicenseType}>
            <SelectTrigger>
              <SelectValue placeholder="Select license type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mit">MIT License</SelectItem>
              <SelectItem value="apache">Apache License 2.0</SelectItem>
              <SelectItem value="gpl">GNU GPL v3</SelectItem>
              <SelectItem value="none">No License</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleExport} 
          disabled={isExporting} 
          className="w-full"
        >
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <GitFork className="w-4 h-4 mr-2" />
              Export to GitHub
            </>
          )}
        </Button>
      </div>
    </div>
  );
}