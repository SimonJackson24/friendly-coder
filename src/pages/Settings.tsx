import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModelParametersSettings } from "@/components/settings/ModelParametersSettings";
import { GeneralSettings } from "@/components/settings/GeneralSettings";
import { DatabaseStatistics } from "@/components/settings/DatabaseStatistics";
import { EditorPreferencesSection } from "@/components/settings/EditorPreferencesSection";
import { SecurityPreferencesSection } from "@/components/settings/SecurityPreferencesSection";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { SettingsExport } from "@/components/settings/SettingsExport";
import { SettingsImport } from "@/components/settings/SettingsImport";
import { useSettings } from "@/hooks/useSettings";
import { Skeleton } from "@/components/ui/skeleton";

const Settings = () => {
  const { settings, isLoading, updateSettings, isUpdating } = useSettings();

  if (!settings && !isLoading) {
    return <div>No settings found</div>;
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      );
    }

    return (
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="model">Model</TabsTrigger>
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
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
            onUpdate={(editorPreferences) => updateSettings({ editorPreferences })}
            isUpdating={isUpdating}
          />
        </TabsContent>

        <TabsContent value="security">
          <SecurityPreferencesSection
            preferences={settings.securityPreferences}
            onUpdate={(securityPreferences) => updateSettings({ securityPreferences })}
            isUpdating={isUpdating}
          />
        </TabsContent>

        <TabsContent value="database">
          <DatabaseStatistics />
        </TabsContent>

        <TabsContent value="backup" className="space-y-4">
          <SettingsExport />
          <SettingsImport />
        </TabsContent>
      </Tabs>
    );
  };

  return (
    <div className="container py-8">
      <SettingsHeader isLoading={isLoading} />
      {renderContent()}
    </div>
  );
};

export default Settings;