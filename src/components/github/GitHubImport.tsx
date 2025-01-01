import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { GitFork, Loader2 } from "lucide-react";
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
      const { data, error } = await supabase.functions.invoke('project-operations', {
        body: { 
          operation: 'github-import',
          data: { repoUrl }
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Repository imported successfully",
      });

      setRepoUrl("");
    } catch (error) {
      console.error('Import error:', error);
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
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Import from GitHub</h3>
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="https://github.com/username/repo"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
          />
          <Button onClick={handleImport} disabled={isImporting}>
            {isImporting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <GitFork className="w-4 h-4 mr-2" />
            )}
            Import
          </Button>
        </div>
      </div>
    </Card>
  );
}