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
import { ModelParametersSettings } from "./settings/ModelParametersSettings";
import { DatabaseSection } from "./settings/DatabaseSection";
import { DeploymentSection } from "./settings/DeploymentSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings2, Database, Github, Box, Rocket } from "lucide-react";

interface ProjectSettingsProps {
  project: any;
}

export function ProjectSettings({ project }: ProjectSettingsProps) {
  const [githubUrl, setGithubUrl] = useState(project?.github_url || "");
  const [envVars, setEnvVars] = useState<string>("");
  const [apiKey, setApiKey] = useState("");
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1000);
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
    <div className="space-y-6">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general">
            <Settings2 className="w-4 h-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <Box className="w-4 h-4 mr-2" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="database">
            <Database className="w-4 h-4 mr-2" />
            Database
          </TabsTrigger>
          <TabsTrigger value="deployment">
            <Rocket className="w-4 h-4 mr-2" />
            Deployment
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">General Settings</h3>
            <div className="space-y-6">
              <EnvironmentVariablesSection 
                envVars={envVars} 
                onChange={setEnvVars} 
              />
              <ModelParametersSettings 
                apiKey={apiKey}
                temperature={temperature}
                maxTokens={maxTokens}
                onApiKeyChange={setApiKey}
                onTemperatureChange={setTemperature}
                onMaxTokensChange={setMaxTokens}
                onSave={handleSave}
              />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Integrations</h3>
            <div className="space-y-6">
              <GitHubSection 
                githubUrl={githubUrl} 
                onChange={setGithubUrl} 
              />
              <Separator />
              <SupabaseOAuthSection />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="database">
          <Card className="p-6">
            <DatabaseSection project={project} />
          </Card>
        </TabsContent>

        <TabsContent value="deployment">
          <Card className="p-6">
            <DeploymentSection project={project} />
          </Card>
        </TabsContent>
      </Tabs>

      <Button 
        onClick={handleSave}
        disabled={updateProjectMutation.isPending}
        className="mt-6"
      >
        {updateProjectMutation.isPending ? "Saving..." : "Save All Settings"}
      </Button>
    </div>
  );
}