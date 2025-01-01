import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { GitFork, Loader2, Github } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useProject } from "@/contexts/ProjectContext";

export function GitHubImport() {
  const [repoUrl, setRepoUrl] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { selectedProject } = useProject();

  const handleImport = async () => {
    if (!repoUrl) {
      toast({
        title: "Error",
        description: "Please enter a repository URL",
        variant: "destructive",
      });
      return;
    }

    if (!selectedProject?.id) {
      toast({
        title: "Error",
        description: "No project selected",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    try {
      console.log('Starting GitHub import process');
      
      const response = await supabase.functions.invoke('project-operations', {
        body: { 
          operation: 'github-import',
          data: { 
            repoUrl,
            projectId: selectedProject.id
          }
        }
      });

      if (response.error) throw response.error;
      console.log('Import successful:', response.data);

      toast({
        title: "Success",
        description: "Repository imported successfully",
      });

      // Redirect to assistant view with the project
      navigate(`/assistant?projectId=${selectedProject.id}`);

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
          Import an existing GitHub repository to start working on it with AI Studio.
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
          disabled={isImporting || !selectedProject} 
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