import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { 
  Github, 
  GitBranch, 
  GitFork, 
  Loader2, 
  Lock,
  Globe,
  GitMerge,
  Settings
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export function GitHubExport() {
  const [repoName, setRepoName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [defaultBranch, setDefaultBranch] = useState("main");
  const [includeWorkflows, setIncludeWorkflows] = useState(true);
  const [licenseType, setLicenseType] = useState("mit");
  const [isExporting, setIsExporting] = useState(false);
  const [recentExports, setRecentExports] = useState<any[]>([]);
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
      const response = await supabase.functions.invoke('project-operations', {
        body: { 
          operation: 'github-export',
          data: { 
            repoName,
            isPrivate,
            defaultBranch,
            includeWorkflows,
            licenseType
          }
        }
      });

      if (response.error) throw response.error;

      toast({
        title: "Success",
        description: "Project exported to GitHub successfully",
      });

      setRecentExports(prev => [{
        name: repoName,
        url: response.data.repository.html_url,
        date: new Date().toISOString(),
        visibility: isPrivate ? "private" : "public"
      }, ...prev].slice(0, 5));

    } catch (error) {
      console.error('GitHub export error:', error);
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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Github className="w-6 h-6" />
        GitHub Export
      </h2>

      <Alert>
        <AlertDescription>
          Export your project to a new GitHub repository with advanced configuration options.
        </AlertDescription>
      </Alert>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="repo-name">Repository Name</Label>
          <Input
            id="repo-name"
            value={repoName}
            onChange={(e) => setRepoName(e.target.value)}
            placeholder="my-awesome-project"
          />
        </div>

        <div className="space-y-4">
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

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="default-branch">Default Branch</Label>
            <Select value={defaultBranch} onValueChange={setDefaultBranch}>
              <SelectTrigger>
                <SelectValue placeholder="Select default branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="main">main</SelectItem>
                <SelectItem value="master">master</SelectItem>
                <SelectItem value="development">development</SelectItem>
              </SelectContent>
            </Select>
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

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>GitHub Actions</Label>
              <div className="text-sm text-muted-foreground">
                Include workflow files for CI/CD
              </div>
            </div>
            <Switch
              checked={includeWorkflows}
              onCheckedChange={setIncludeWorkflows}
            />
          </div>
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

      <div className="border-t pt-4">
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <GitBranch className="w-4 h-4" />
          Recent Exports
        </h3>
        {recentExports.length > 0 ? (
          <div className="space-y-2">
            {recentExports.map((export_, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg border">
                <div className="space-y-1">
                  <a
                    href={export_.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline font-medium"
                  >
                    {export_.name}
                  </a>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    {export_.visibility === 'private' ? 
                      <Lock className="w-3 h-3" /> : 
                      <Globe className="w-3 h-3" />
                    }
                    {new Date(export_.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a 
                      href={`${export_.url}/settings`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Settings className="w-4 h-4" />
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a 
                      href={`${export_.url}/pulls`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <GitMerge className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            No recent exports found
          </div>
        )}
      </div>
    </div>
  );
}