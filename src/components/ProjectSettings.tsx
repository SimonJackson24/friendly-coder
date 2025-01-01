import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProjectSettingsProps {
  project: any;
}

export function ProjectSettings({ project }: ProjectSettingsProps) {
  const [githubUrl, setGithubUrl] = useState(project?.github_url || "");
  const [supabaseUrl, setSupabaseUrl] = useState(project?.supabase_url || "");
  const [envVars, setEnvVars] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    if (project) {
      setGithubUrl(project.github_url || "");
      setSupabaseUrl(project.supabase_url || "");
      // Load environment variables from project settings
      console.log("Loading project settings");
    }
  }, [project]);

  const updateProjectMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!project?.id) return;

      console.log("Updating project settings:", data);
      const { error } = await supabase
        .from("projects")
        .update(data)
        .eq("id", project.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Settings Saved",
        description: "Project settings have been updated successfully",
      });
    },
    onError: (error) => {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save project settings",
        variant: "destructive",
      });
    },
  });

  const handleSave = async () => {
    updateProjectMutation.mutate({
      github_url: githubUrl,
      supabase_url: supabaseUrl,
    });
  };

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">Project Settings</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="github-url">GitHub URL</Label>
          <Input
            id="github-url"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="https://github.com/username/repo"
          />
        </div>
        <div>
          <Label htmlFor="supabase-url">Supabase URL</Label>
          <Input
            id="supabase-url"
            value={supabaseUrl}
            onChange={(e) => setSupabaseUrl(e.target.value)}
            placeholder="https://your-project.supabase.co"
          />
        </div>
        <div>
          <Label htmlFor="env-vars">Environment Variables</Label>
          <Textarea
            id="env-vars"
            value={envVars}
            onChange={(e) => setEnvVars(e.target.value)}
            placeholder="KEY=value"
            className="font-mono"
            rows={5}
          />
          <p className="text-sm text-muted-foreground mt-1">
            One variable per line, in KEY=value format
          </p>
        </div>
        <Button 
          onClick={handleSave}
          disabled={updateProjectMutation.isPending}
        >
          {updateProjectMutation.isPending ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </Card>
  );
}