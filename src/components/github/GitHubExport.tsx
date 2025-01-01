import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Github, GitBranch, GitFork, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function GitHubExport() {
  const [repoName, setRepoName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
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
            isPrivate
          }
        }
      });

      if (response.error) throw response.error;

      toast({
        title: "Success",
        description: "Project exported to GitHub successfully",
      });

      // Add to recent exports
      setRecentExports(prev => [{
        name: repoName,
        url: response.data.repository.html_url,
        date: new Date().toISOString()
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
          Export your project to a new GitHub repository. This will create a new repository and push your current code to it.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Repository Name</label>
          <Input
            value={repoName}
            onChange={(e) => setRepoName(e.target.value)}
            placeholder="my-awesome-project"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="private"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
            className="rounded border-gray-300"
          />
          <label htmlFor="private" className="text-sm font-medium">
            Private Repository
          </label>
        </div>

        <Button onClick={handleExport} disabled={isExporting} className="w-full">
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
              <div key={index} className="text-sm">
                <a
                  href={export_.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {export_.name}
                </a>
                <span className="text-muted-foreground ml-2">
                  {new Date(export_.date).toLocaleDateString()}
                </span>
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