import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface ProjectSettingsProps {
  project: any;
}

export function ProjectSettings({ project }: ProjectSettingsProps) {
  const [githubUrl, setGithubUrl] = useState(project?.github_url || "");
  const [supabaseUrl, setSupabaseUrl] = useState(project?.supabase_url || "");
  const { toast } = useToast();

  const handleSave = async () => {
    // Implement settings save functionality
    toast({
      title: "Save Settings",
      description: "Settings saving functionality coming soon",
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
        <Button onClick={handleSave}>Save Settings</Button>
      </div>
    </Card>
  );
}