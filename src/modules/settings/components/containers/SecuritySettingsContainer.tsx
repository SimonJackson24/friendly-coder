import { SecurityPreferencesSection } from "@/components/settings/SecurityPreferencesSection";
import { useSettings } from "@/hooks/useSettings";

export function SecuritySettingsContainer() {
  const { settings, updateSettings, isUpdating } = useSettings();

  if (!settings) return null;

  return (
    <SecurityPreferencesSection
      preferences={settings.securityPreferences}
      onUpdate={(securityPreferences) => updateSettings({ securityPreferences })}
      isUpdating={isUpdating}
    />
  );
}