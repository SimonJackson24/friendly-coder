import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

interface GeneralSettingsProps {
  theme: string;
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
  };
  buildPreferences: {
    autoSave: boolean;
    lintOnSave: boolean;
  };
  onThemeChange: (value: string) => void;
  onLanguageChange: (value: string) => void;
  onNotificationsChange: (value: { email: boolean; push: boolean }) => void;
  onBuildPreferencesChange: (value: { autoSave: boolean; lintOnSave: boolean }) => void;
  onSave: () => void;
}

export function GeneralSettings({
  theme,
  language,
  notifications,
  buildPreferences,
  onThemeChange,
  onLanguageChange,
  onNotificationsChange,
  onBuildPreferencesChange,
  onSave,
}: GeneralSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
        <CardDescription>
          Configure your application preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Theme</Label>
          <Select value={theme} onValueChange={onThemeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Language</Label>
          <Select value={language} onValueChange={onLanguageChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <Label>Notifications</Label>
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications">Email Notifications</Label>
            <Switch
              id="email-notifications"
              checked={notifications.email}
              onCheckedChange={(checked) =>
                onNotificationsChange({ ...notifications, email: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="push-notifications">Push Notifications</Label>
            <Switch
              id="push-notifications"
              checked={notifications.push}
              onCheckedChange={(checked) =>
                onNotificationsChange({ ...notifications, push: checked })
              }
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label>Build Preferences</Label>
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-save">Auto Save</Label>
            <Switch
              id="auto-save"
              checked={buildPreferences.autoSave}
              onCheckedChange={(checked) =>
                onBuildPreferencesChange({ ...buildPreferences, autoSave: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="lint-on-save">Lint on Save</Label>
            <Switch
              id="lint-on-save"
              checked={buildPreferences.lintOnSave}
              onCheckedChange={(checked) =>
                onBuildPreferencesChange({ ...buildPreferences, lintOnSave: checked })
              }
            />
          </div>
        </div>

        <Button onClick={onSave} className="w-full">
          Save Settings
        </Button>
      </CardContent>
    </Card>
  );
}