import { GeneralSettings } from "@/components/settings/GeneralSettings";
import { useSettings } from "@/hooks/useSettings";

export function GeneralSettingsContainer() {
  const { settings, updateSettings } = useSettings();

  if (!settings) return null;

  return (
    <GeneralSettings
      theme={settings.theme}
      language={settings.language}
      notifications={settings.notifications}
      buildPreferences={settings.buildPreferences}
      onThemeChange={(theme) => updateSettings({ theme })}
      onLanguageChange={(language) => updateSettings({ language })}
      onNotificationsChange={(notifications) => updateSettings({ notifications })}
      onBuildPreferencesChange={(preferences) => updateSettings({ buildPreferences: preferences })}
      onSave={() => {
        updateSettings({
          theme: settings.theme,
          language: settings.language,
          notifications: settings.notifications,
          buildPreferences: settings.buildPreferences,
        });
      }}
    />
  );
}