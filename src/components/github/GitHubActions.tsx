import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GitHubExport } from "./GitHubExport";
import { GitHubImport } from "./GitHubImport";
import { ProjectProvider } from "@/contexts/ProjectContext";

export function GitHubActions() {
  return (
    <ProjectProvider>
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
    </ProjectProvider>
  );
}