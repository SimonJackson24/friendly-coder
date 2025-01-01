import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface GitHubSectionProps {
  githubUrl: string;
  onChange: (url: string) => void;
}

export function GitHubSection({ githubUrl, onChange }: GitHubSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>GitHub Integration</CardTitle>
        <CardDescription>
          Configure your GitHub repository URL
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="github-url">GitHub Repository URL</Label>
          <Input
            id="github-url"
            type="text"
            value={githubUrl}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://github.com/username/repository"
          />
          <p className="text-sm text-muted-foreground mt-1">
            The URL of your GitHub repository for version control
          </p>
        </div>
      </CardContent>
    </Card>
  );
}