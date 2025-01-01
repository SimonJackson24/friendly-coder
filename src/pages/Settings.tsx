import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModelParametersSettings } from "@/components/settings/ModelParametersSettings";
import { GeneralSettings } from "@/components/settings/GeneralSettings";
import { DatabaseStatistics } from "@/components/settings/DatabaseStatistics";
import { EditorPreferencesSection } from "@/components/settings/EditorPreferencesSection";
import { SecurityPreferencesSection } from "@/components/settings/SecurityPreferencesSection";
import { useSettings } from "@/hooks/useSettings";

const Settings = () => {
  const { settings, isLoading, updateSettings, isUpdating } = useSettings();

  if (isLoading) {
    return <div>Loading settings...</div>;
  }

  if (!settings) {
    return <div>No settings found</div>;
  }

  const handleGeneralSettingsUpdate = (newSettings: any) => {
    updateSettings({
      theme: newSettings.theme,
      language: newSettings.language,
      notifications: newSettings.notifications as unknown as Json,
      build_preferences: newSettings.buildPreferences as unknown as Json,
    });
  };

  const handleModelSettingsUpdate = () => {
    updateSettings({
      api_key: settings.api_key,
      temperature: settings.temperature,
      max_tokens: settings.max_tokens,
    });
  };

  const handleEditorPreferencesUpdate = (preferences: any) => {
    updateSettings({
      editor_preferences: preferences as unknown as Json,
    });
  };

  const handleSecurityPreferencesUpdate = (preferences: any) => {
    updateSettings({
      security_preferences: preferences as unknown as Json,
    });
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="model">Model</TabsTrigger>
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralSettings
            theme={settings.theme}
            language={settings.language}
            notifications={settings.notifications as unknown as any}
            buildPreferences={settings.build_preferences as unknown as any}
            onThemeChange={(theme) => updateSettings({ theme })}
            onLanguageChange={(language) => updateSettings({ language })}
            onNotificationsChange={(notifications) => 
              updateSettings({ notifications: notifications as unknown as Json })}
            onBuildPreferencesChange={(preferences) => 
              updateSettings({ build_preferences: preferences as unknown as Json })}
            onSave={handleGeneralSettingsUpdate}
          />
        </TabsContent>

        <TabsContent value="model">
          <ModelParametersSettings
            apiKey={settings.api_key || ""}
            temperature={settings.temperature || 0.7}
            maxTokens={settings.max_tokens || 1000}
            onApiKeyChange={(apiKey) => updateSettings({ api_key: apiKey })}
            onTemperatureChange={(temperature) => updateSettings({ temperature })}
            onMaxTokensChange={(maxTokens) => updateSettings({ max_tokens: maxTokens })}
            onSave={handleModelSettingsUpdate}
          />
        </TabsContent>

        <TabsContent value="editor">
          <EditorPreferencesSection
            preferences={settings.editor_preferences as unknown as any}
            onUpdate={handleEditorPreferencesUpdate}
            isUpdating={isUpdating}
          />
        </TabsContent>

        <TabsContent value="security">
          <SecurityPreferencesSection
            preferences={settings.security_preferences as unknown as any}
            onUpdate={handleSecurityPreferencesUpdate}
            isUpdating={isUpdating}
          />
        </TabsContent>

        <TabsContent value="database">
          <DatabaseStatistics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;