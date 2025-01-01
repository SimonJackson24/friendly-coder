import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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

    // Extract owner and repo from URL
    const urlMatch = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!urlMatch) {
      toast({
        title: "Error",
        description: "Invalid GitHub repository URL",
        variant: "destructive",
      });
      return;
    }

    const [, owner, repo] = urlMatch;
    console.log('Importing from GitHub:', { owner, repo });

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
      // Fetch repository contents directly from GitHub's public API
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents`);
      if (!response.ok) {
        throw new Error('Failed to fetch repository contents');
      }

      const contents = await response.json();
      console.log('Fetched repository contents:', contents);

      // Update project with GitHub URL
      await supabase
        .from('projects')
        .update({ 
          github_url: repoUrl,
          github_import_status: 'importing'
        })
        .eq('id', selectedProject.id);

      // Import each file
      for (const item of contents) {
        if (item.type === 'file') {
          const fileContent = await fetch(item.download_url).then(res => res.text());
          await supabase
            .from('files')
            .insert({
              project_id: selectedProject.id,
              name: item.name,
              path: item.path,
              content: fileContent,
              type: 'file'
            });
        }
      }

      // Update import status
      await supabase
        .from('projects')
        .update({ 
          github_import_status: 'completed',
          github_branch: 'main'
        })
        .eq('id', selectedProject.id);

      toast({
        title: "Success",
        description: "Repository imported successfully",
      });

      navigate(`/assistant?projectId=${selectedProject.id}`);

    } catch (error) {
      console.error('GitHub import error:', error);
      toast({
        title: "Error",
        description: "Failed to import repository. Make sure the repository is public.",
        variant: "destructive",
      });

      await supabase
        .from('projects')
        .update({ 
          github_import_status: 'error',
          github_import_error: error.message
        })
        .eq('id', selectedProject.id);
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

      {!selectedProject ? (
        <Alert variant="destructive">
          <AlertTitle>No Project Selected</AlertTitle>
          <AlertDescription>
            Please select a project from the dropdown above before importing a repository.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert>
          <AlertDescription>
            Import a public GitHub repository by entering its URL below. Private repositories require authentication through Settings.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Input
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/username/repo"
            disabled={!selectedProject}
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