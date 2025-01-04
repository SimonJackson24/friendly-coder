import { EditorPreferencesSection } from "@/components/settings/EditorPreferencesSection";
import { useSettings } from "@/hooks/useSettings";

export function EditorSettingsContainer() {
  const { settings, updateSettings, isUpdating } = useSettings();

  if (!settings) return null;

  return (
    <EditorPreferencesSection
      preferences={settings.editorPreferences}
      onUpdate={(editorPreferences) => updateSettings({ editorPreferences })}
      isUpdating={isUpdating}
    />
  );
}