import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Separator } from "@/components/ui/separator";
import { GitHubSection } from "./settings/GitHubSection";
import { SupabaseOAuthSection } from "./settings/SupabaseOAuthSection";
import { EnvironmentVariablesSection } from "./settings/EnvironmentVariablesSection";
import { AndroidBuildSection } from "./settings/AndroidBuildSection";

interface ProjectSettingsProps {
  project: any;
}

export function ProjectSettings({ project }: ProjectSettingsProps) {
  const [githubUrl, setGithubUrl] = useState(project?.github_url || "");
  const [envVars, setEnvVars] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    if (project) {
      setGithubUrl(project.github_url || "");
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
    });
  };

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">Project Settings</h2>
      
      <div className="space-y-6">
        <GitHubSection 
          githubUrl={githubUrl} 
          onChange={setGithubUrl} 
        />

        <Separator />

        <SupabaseOAuthSection />

        <Separator />

        <EnvironmentVariablesSection 
          envVars={envVars} 
          onChange={setEnvVars} 
        />

        <Separator />

        <AndroidBuildSection projectId={project?.id} />

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