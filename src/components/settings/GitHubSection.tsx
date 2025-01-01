import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface GitHubSectionProps {
  githubToken: string;
  onChange: (token: string) => void;
}

export function GitHubSection({ githubToken, onChange }: GitHubSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>GitHub Integration</CardTitle>
        <CardDescription>
          Configure your GitHub integration settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="github-token">GitHub Personal Access Token</Label>
          <Input
            id="github-token"
            type="password"
            value={githubToken}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter your GitHub token"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Required for GitHub repository operations
          </p>
        </div>
      </CardContent>
    </Card>
  );
}