import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { SecurityPreferences } from "@/hooks/useSettings";

interface SecurityPreferencesSectionProps {
  preferences: SecurityPreferences;
  onUpdate: (preferences: SecurityPreferences) => void;
  isUpdating?: boolean;
}

export function SecurityPreferencesSection({
  preferences,
  onUpdate,
  isUpdating
}: SecurityPreferencesSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Preferences</CardTitle>
        <CardDescription>
          Configure your security and privacy settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Access Level</Label>
          <Select 
            value={preferences.accessLevel} 
            onValueChange={(value) => onUpdate({ ...preferences, accessLevel: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select access level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="private">Private</SelectItem>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="team">Team Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Data Retention (days): {preferences.dataRetentionDays}</Label>
          <Slider
            value={[preferences.dataRetentionDays]}
            onValueChange={(values) => onUpdate({ ...preferences, dataRetentionDays: values[0] })}
            min={7}
            max={365}
            step={7}
          />
        </div>

        <div className="space-y-2">
          <Label>API Key Rotation (days): {preferences.apiKeyRotationDays}</Label>
          <Slider
            value={[preferences.apiKeyRotationDays]}
            onValueChange={(values) => onUpdate({ ...preferences, apiKeyRotationDays: values[0] })}
            min={30}
            max={180}
            step={30}
          />
        </div>
      </CardContent>
    </Card>
  );
}