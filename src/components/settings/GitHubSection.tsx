import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GitHubSectionProps {
  githubUrl: string;
  onChange: (url: string) => void;
}

export function GitHubSection({ githubUrl, onChange }: GitHubSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-md font-medium">GitHub Configuration</h3>
      <div>
        <Label htmlFor="github-url">GitHub URL</Label>
        <Input
          id="github-url"
          value={githubUrl}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://github.com/username/repo"
        />
      </div>
    </div>
  );
}