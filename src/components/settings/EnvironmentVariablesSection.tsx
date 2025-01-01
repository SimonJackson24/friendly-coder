import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface EnvironmentVariablesSectionProps {
  envVars: string;
  onChange: (vars: string) => void;
}

export function EnvironmentVariablesSection({ envVars, onChange }: EnvironmentVariablesSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-md font-medium">Environment Variables</h3>
      <div>
        <Label htmlFor="env-vars">Environment Variables</Label>
        <Textarea
          id="env-vars"
          value={envVars}
          onChange={(e) => onChange(e.target.value)}
          placeholder="KEY=value"
          className="font-mono"
          rows={5}
        />
        <p className="text-sm text-muted-foreground mt-1">
          One variable per line, in KEY=value format
        </p>
      </div>
    </div>
  );
}