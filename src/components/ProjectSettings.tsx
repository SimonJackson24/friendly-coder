import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, ExternalLink } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProjectSettingsProps {
  project: any;
}

export function ProjectSettings({ project }: ProjectSettingsProps) {
  const [githubUrl, setGithubUrl] = useState(project?.github_url || "");
  const [supabaseUrl, setSupabaseUrl] = useState(project?.supabase_url || "");
  const [supabaseKey, setSupabaseKey] = useState("");
  const [envVars, setEnvVars] = useState<string>("");
  const [showSupabaseHelp, setShowSupabaseHelp] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (project) {
      setGithubUrl(project.github_url || "");
      setSupabaseUrl(project.supabase_url || "");
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

  const handleCreateSupabaseProject = () => {
    window.open("https://supabase.com/dashboard/sign-in", "_blank");
  };

  const handleOpenSupabaseProject = () => {
    if (!supabaseUrl) {
      toast({
        title: "No Supabase URL",
        description: "Please add your Supabase project URL first",
        variant: "destructive",
      });
      return;
    }
    window.open(supabaseUrl, "_blank");
  };

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">Project Settings</h2>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-md font-medium">GitHub Configuration</h3>
          <div>
            <Label htmlFor="github-url">GitHub URL</Label>
            <Input
              id="github-url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/username/repo"
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-md font-medium">Supabase Configuration</h3>
          
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Connect your Supabase project</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>
                To use Supabase with your project, you'll need to:
              </p>
              <ol className="list-decimal ml-4 space-y-1">
                <li>Create a Supabase account if you haven't already</li>
                <li>Create a new project in Supabase</li>
                <li>Copy your project URL and paste it below</li>
              </ol>
              <Button 
                variant="link" 
                className="p-0 h-auto text-sm"
                onClick={() => setShowSupabaseHelp(true)}
              >
                Need help setting up Supabase?
              </Button>
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div>
              <Label htmlFor="supabase-url">Supabase Project URL</Label>
              <Input
                id="supabase-url"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                placeholder="https://your-project.supabase.co"
              />
            </div>

            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={handleCreateSupabaseProject}
                className="flex items-center"
              >
                Sign in to Supabase
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                onClick={handleOpenSupabaseProject}
                className="flex items-center"
              >
                Open Project Dashboard
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-md font-medium">Environment Variables</h3>
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
        </div>

        <Button 
          onClick={handleSave}
          disabled={updateProjectMutation.isPending}
        >
          {updateProjectMutation.isPending ? "Saving..." : "Save Settings"}
        </Button>
      </div>

      <Dialog open={showSupabaseHelp} onOpenChange={setShowSupabaseHelp}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Setting up Supabase</DialogTitle>
            <DialogDescription className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">1. Create a Supabase Account</h4>
                <p>Visit <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">Supabase.com</a> and sign up for an account if you haven't already.</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">2. Create a New Project</h4>
                <p>After signing in:</p>
                <ol className="list-decimal ml-4 space-y-1">
                  <li>Click "New Project"</li>
                  <li>Choose a name and password for your project</li>
                  <li>Select a region (choose one close to your users)</li>
                  <li>Click "Create Project"</li>
                </ol>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">3. Get Your Project URL</h4>
                <p>Once your project is created:</p>
                <ol className="list-decimal ml-4 space-y-1">
                  <li>Go to Project Settings</li>
                  <li>Find the "Project URL" under "Project Configuration"</li>
                  <li>Copy this URL and paste it in the settings above</li>
                </ol>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </Card>
  );
}