import { ModelParametersSettings } from "@/components/settings/ModelParametersSettings";
import { useSettings } from "@/hooks/useSettings";

export function ModelSettingsContainer() {
  const { settings, updateSettings } = useSettings();

  if (!settings) return null;

  return (
    <ModelParametersSettings
      apiKey={settings.apiKey}
      temperature={settings.temperature}
      maxTokens={settings.maxTokens}
      onApiKeyChange={(apiKey) => updateSettings({ apiKey })}
      onTemperatureChange={(temperature) => updateSettings({ temperature })}
      onMaxTokensChange={(maxTokens) => updateSettings({ maxTokens })}
      onSave={() => {
        updateSettings({
          apiKey: settings.apiKey,
          temperature: settings.temperature,
          maxTokens: settings.maxTokens,
        });
      }}
    />
  );
}