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

  const handleEditorPreferencesUpdate = (editorPreferences: any) => {
    updateSettings({ editorPreferences });
  };

  const handleSecurityPreferencesUpdate = (securityPreferences: any) => {
    updateSettings({ securityPreferences });
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
        </TabsContent>

        <TabsContent value="model">
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
        </TabsContent>

        <TabsContent value="editor">
          <EditorPreferencesSection
            preferences={settings.editorPreferences}
            onUpdate={handleEditorPreferencesUpdate}
            isUpdating={isUpdating}
          />
        </TabsContent>

        <TabsContent value="security">
          <SecurityPreferencesSection
            preferences={settings.securityPreferences}
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