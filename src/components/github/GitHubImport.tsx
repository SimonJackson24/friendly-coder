import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { GitFork, Loader2, Github } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function GitHubImport() {
  const [repoUrl, setRepoUrl] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  const handleImport = async () => {
    if (!repoUrl) {
      toast({
        title: "Error",
        description: "Please enter a repository URL",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    try {
      const response = await supabase.functions.invoke('project-operations', {
        body: { 
          operation: 'github-import',
          data: { repoUrl }
        }
      });

      if (response.error) throw response.error;

      toast({
        title: "Success",
        description: "Repository imported successfully",
      });

    } catch (error) {
      console.error('GitHub import error:', error);
      toast({
        title: "Error",
        description: "Failed to import repository",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Github className="w-6 h-6" />
        Import from GitHub
      </h2>

      <Alert>
        <AlertDescription>
          Import an existing GitHub repository to start working on it with Lovable.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div className="space-y-2">
          <Input
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/username/repo"
          />
        </div>

        <Button 
          onClick={handleImport} 
          disabled={isImporting} 
          className="w-full"
        >
          {isImporting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Importing...
            </>
          ) : (
            <>
              <GitFork className="w-4 h-4 mr-2" />
              Import Repository
            </>
          )}
        </Button>
      </div>
    </div>
  );
}