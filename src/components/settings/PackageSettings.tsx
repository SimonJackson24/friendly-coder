import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PackageSettingsProps {
  registry: string;
  onRegistryChange: (value: string) => void;
}

export function PackageSettings({
  registry,
  onRegistryChange,
}: PackageSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Package Settings</CardTitle>
        <CardDescription>
          Configure your package manager preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="registry">Default Package Registry</Label>
          <Select value={registry} onValueChange={onRegistryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select registry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="npm">npm</SelectItem>
              <SelectItem value="yarn">Yarn</SelectItem>
              <SelectItem value="pnpm">pnpm</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}