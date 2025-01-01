import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface AIModelSettingsProps {
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  onApiKeyChange: (value: string) => void;
  onModelChange: (value: string) => void;
  onTemperatureChange: (value: number) => void;
  onMaxTokensChange: (value: number) => void;
}

export function AIModelSettings({
  apiKey,
  model,
  temperature,
  maxTokens,
  onApiKeyChange,
  onModelChange,
  onTemperatureChange,
  onMaxTokensChange,
}: AIModelSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Model Settings</CardTitle>
        <CardDescription>
          Configure the AI model parameters for code generation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="api-key">Anthropic API Key</Label>
          <Input
            id="api-key"
            type="password"
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
            placeholder="Enter your Anthropic API key"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Select value={model} onValueChange={onModelChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="claude-3-opus-20240229">Claude 3 Opus</SelectItem>
              <SelectItem value="claude-3-sonnet-20240229">Claude 3 Sonnet</SelectItem>
              <SelectItem value="claude-3-haiku-20240229">Claude 3 Haiku</SelectItem>
            </SelectContent>
          </Select>
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
          <p className="text-sm text-muted-foreground">
            Controls randomness: 0 is focused, 1 is more creative
          </p>
        </div>

        <div className="space-y-2">
          <Label>Max Tokens: {maxTokens}</Label>
          <Slider
            value={[maxTokens]}
            onValueChange={(values) => onMaxTokensChange(values[0])}
            max={4000}
            step={100}
            className="w-full"
          />
          <p className="text-sm text-muted-foreground">
            Maximum length of generated responses
          </p>
        </div>
      </CardContent>
    </Card>
  );
}