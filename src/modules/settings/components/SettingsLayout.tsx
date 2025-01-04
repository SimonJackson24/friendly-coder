import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { SettingsHeader } from "./SettingsHeader";
import { GeneralSettingsContainer } from "./containers/GeneralSettingsContainer";
import { IntegrationsContainer } from "./containers/IntegrationsContainer";
import { ModelSettingsContainer } from "./containers/ModelSettingsContainer";
import { EditorSettingsContainer } from "./containers/EditorSettingsContainer";
import { SecuritySettingsContainer } from "./containers/SecuritySettingsContainer";
import { DatabaseSettingsContainer } from "./containers/DatabaseSettingsContainer";
import { BackupSettingsContainer } from "./containers/BackupSettingsContainer";
import { useSettings } from "@/hooks/useSettings";

export function SettingsLayout() {
  const { settings, isLoading } = useSettings();

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
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="model">Model</TabsTrigger>
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralSettingsContainer />
        </TabsContent>

        <TabsContent value="integrations">
          <IntegrationsContainer />
        </TabsContent>

        <TabsContent value="model">
          <ModelSettingsContainer />
        </TabsContent>

        <TabsContent value="editor">
          <EditorSettingsContainer />
        </TabsContent>

        <TabsContent value="security">
          <SecuritySettingsContainer />
        </TabsContent>

        <TabsContent value="database">
          <DatabaseSettingsContainer />
        </TabsContent>

        <TabsContent value="backup">
          <BackupSettingsContainer />
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
}