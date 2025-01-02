import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GitHubExport } from "./GitHubExport";
import { GitHubImport } from "./GitHubImport";
import { ProjectProvider } from "@/contexts/ProjectContext";
import { Card } from "@/components/ui/card";

export function GitHubActions() {
  return (
    <ProjectProvider>
      <Card className="p-6 bg-black/75 backdrop-blur-md border-white/10">
        <Tabs defaultValue="import" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="import">Import</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>
          
          <TabsContent value="import" className="mt-4">
            <GitHubImport />
          </TabsContent>
          
          <TabsContent value="export" className="mt-4">
            <GitHubExport />
          </TabsContent>
        </Tabs>
      </Card>
    </ProjectProvider>
  );
}