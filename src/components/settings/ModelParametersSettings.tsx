import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface ModelParametersSettingsProps {
  apiKey: string;
  temperature: number;
  maxTokens: number;
  onApiKeyChange: (value: string) => void;
  onTemperatureChange: (value: number) => void;
  onMaxTokensChange: (value: number) => void;
  onSave: () => void;
}

export function ModelParametersSettings({
  apiKey,
  temperature,
  maxTokens,
  onApiKeyChange,
  onTemperatureChange,
  onMaxTokensChange,
  onSave,
}: ModelParametersSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Model Parameters</CardTitle>
        <CardDescription>
          Configure the parameters used for generating content
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="api-key">API Key</Label>
          <Input
            id="api-key"
            type="password"
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
            placeholder="Enter your API key"
          />
        </div>

        <div className="space-y-2">
          <Label>Temperature: {temperature}</Label>
          <Slider
            value={[temperature]}
            onValueChange={(values) => onTemperatureChange(values[0])}
            max={1}
            step={0.1}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label>Max Tokens: {maxTokens}</Label>
          <Slider
            value={[maxTokens]}
            onValueChange={(values) => onMaxTokensChange(values[0])}
            max={2000}
            step={100}
            className="w-full"
          />
        </div>

        <Button onClick={onSave} className="w-full">
          Save Settings
        </Button>
      </CardContent>
    </Card>
  );
}