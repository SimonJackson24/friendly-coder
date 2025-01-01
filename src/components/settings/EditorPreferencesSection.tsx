import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { EditorPreferences } from "@/hooks/useSettings";

interface EditorPreferencesSectionProps {
  preferences: EditorPreferences;
  onUpdate: (preferences: EditorPreferences) => void;
  isUpdating?: boolean;
}

export function EditorPreferencesSection({
  preferences,
  onUpdate,
  isUpdating
}: EditorPreferencesSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Editor Preferences</CardTitle>
        <CardDescription>
          Customize your code editor experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Theme</Label>
          <Select 
            value={preferences.theme} 
            onValueChange={(value) => onUpdate({ ...preferences, theme: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vs-dark">Dark</SelectItem>
              <SelectItem value="vs-light">Light</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Font Size: {preferences.fontSize}px</Label>
          <Slider
            value={[preferences.fontSize]}
            onValueChange={(values) => onUpdate({ ...preferences, fontSize: values[0] })}
            min={12}
            max={24}
            step={1}
          />
        </div>

        <div className="space-y-2">
          <Label>Tab Size: {preferences.tabSize}</Label>
          <Slider
            value={[preferences.tabSize]}
            onValueChange={(values) => onUpdate({ ...preferences, tabSize: values[0] })}
            min={2}
            max={8}
            step={2}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="line-wrapping">Line Wrapping</Label>
          <Switch
            id="line-wrapping"
            checked={preferences.lineWrapping}
            onCheckedChange={(checked) => onUpdate({ ...preferences, lineWrapping: checked })}
          />
        </div>

        <div className="space-y-2">
          <Label>Font Family</Label>
          <Select 
            value={preferences.fontFamily} 
            onValueChange={(value) => onUpdate({ ...preferences, fontFamily: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select font" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monospace">Monospace</SelectItem>
              <SelectItem value="consolas">Consolas</SelectItem>
              <SelectItem value="fira-code">Fira Code</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}