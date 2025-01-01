import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { InfoIcon } from "lucide-react";

interface GitHubSectionProps {
  githubUrl: string;
  onChange: (url: string) => void;
}

export function GitHubSection({ githubUrl, onChange }: GitHubSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-md font-medium">GitHub Configuration</h3>
      
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          Connect your project to GitHub for version control and collaboration
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div>
          <Label htmlFor="github-url">GitHub Repository URL</Label>
          <Input
            id="github-url"
            value={githubUrl}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://github.com/username/repo"
          />
          <p className="text-sm text-muted-foreground mt-1">
            The URL of your GitHub repository
          </p>
        </div>

        <div className="flex items-center justify-between space-x-2">
          <div className="space-y-0.5">
            <Label>Auto-sync Changes</Label>
            <p className="text-sm text-muted-foreground">
              Automatically sync changes to GitHub
            </p>
          </div>
          <Switch />
        </div>
      </div>
    </div>
  );
}