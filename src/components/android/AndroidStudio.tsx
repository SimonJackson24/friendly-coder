import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AndroidProjectSelector } from "./AndroidProjectSelector";
import { AndroidBuildConfig } from "./AndroidBuildConfig";
import { AndroidPreview } from "./AndroidPreview";
import { AndroidBuildStatus } from "./AndroidBuildStatus";
import { useToast } from "@/components/ui/use-toast";

export function AndroidStudio() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleProjectSelect = (projectId: string) => {
    console.log("Selected project for Android build:", projectId);
    setSelectedProjectId(projectId);
  };

  return (
    <Card className="p-4">
      <h2 className="text-2xl font-bold mb-6">Android Studio</h2>
      
      <div className="mb-6">
        <AndroidProjectSelector onProjectSelect={handleProjectSelect} />
      </div>

      {selectedProjectId ? (
        <Tabs defaultValue="config" className="space-y-4">
          <TabsList>
            <TabsTrigger value="config">Configuration</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="build">Build Status</TabsTrigger>
          </TabsList>

          <TabsContent value="config">
            <AndroidBuildConfig projectId={selectedProjectId} />
          </TabsContent>

          <TabsContent value="preview">
            <AndroidPreview projectId={selectedProjectId} />
          </TabsContent>

          <TabsContent value="build">
            <AndroidBuildStatus projectId={selectedProjectId} />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="text-center text-muted-foreground">
          Select a project to start building your Android app
        </div>
      )}
    </Card>
  );
}