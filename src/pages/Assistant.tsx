import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ChatInterface } from "@/components/ChatInterface";
import { FileExplorer } from "@/components/FileExplorer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { FileEditor } from "@/components/FileEditor";
import { ProjectSettings } from "@/components/ProjectSettings";
import { Console } from "@/components/Console";

interface FileNode {
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
  content?: string;
}

const Assistant = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId");
  const { toast } = useToast();
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [buildErrors, setBuildErrors] = useState<string[]>([]);
  
  // Mock file structure for demonstration
  const mockFiles: FileNode[] = [
    {
      name: "src",
      type: "folder",
      children: [
        {
          name: "components",
          type: "folder",
          children: [
            { name: "ChatInterface.tsx", type: "file", content: "// Component code here" },
            { name: "FileExplorer.tsx", type: "file", content: "// Component code here" },
          ],
        },
        { name: "App.tsx", type: "file", content: "// App code here" },
        { name: "main.tsx", type: "file", content: "// Main code here" },
      ],
    },
    {
      name: "public",
      type: "folder",
      children: [
        { name: "favicon.ico", type: "file" },
        { name: "index.html", type: "file" },
      ],
    },
  ];

  const { data: project } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      if (!projectId) return null;
      
      console.log("Fetching project details:", projectId);
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();

      if (error) {
        console.error("Error fetching project:", error);
        toast({
          title: "Error",
          description: "Failed to load project details",
          variant: "destructive",
        });
        throw error;
      }

      console.log("Project details loaded:", data);
      if (data.supabase_url) {
        setPreviewUrl(data.supabase_url);
      }
      return data;
    },
    enabled: !!projectId,
  });

  const handleFileSelect = (file: FileNode) => {
    console.log("Selected file:", file);
    setSelectedFile(file);
  };

  const handleFileCreate = () => {
    // Implement file creation logic
    toast({
      title: "Create File",
      description: "File creation functionality coming soon",
    });
  };

  const handleFileDelete = () => {
    if (!selectedFile) return;
    // Implement file deletion logic
    toast({
      title: "Delete File",
      description: "File deletion functionality coming soon",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {project && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold">{project.title}</h1>
            {project.description && (
              <p className="text-muted-foreground mt-2">{project.description}</p>
            )}
          </div>
        )}
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-3">
            <Card className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Files</h2>
                <div className="space-x-2">
                  <Button size="sm" onClick={handleFileCreate}>New</Button>
                  <Button size="sm" variant="destructive" onClick={handleFileDelete} disabled={!selectedFile}>
                    Delete
                  </Button>
                </div>
              </div>
              <FileExplorer files={mockFiles} onFileSelect={handleFileSelect} />
            </Card>
          </div>
          
          <div className="col-span-5">
            <Tabs defaultValue="chat" className="h-full">
              <TabsList>
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="editor">Editor</TabsTrigger>
                <TabsTrigger value="console">Console</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="chat" className="mt-4">
                <ChatInterface projectId={projectId} />
              </TabsContent>
              
              <TabsContent value="editor" className="mt-4">
                <FileEditor file={selectedFile} />
              </TabsContent>
              
              <TabsContent value="console" className="mt-4">
                <Console logs={consoleOutput} errors={buildErrors} />
              </TabsContent>
              
              <TabsContent value="settings" className="mt-4">
                <ProjectSettings project={project} />
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="col-span-4">
            <Card>
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Preview</h2>
              </div>
              <iframe
                title="Live Preview"
                className="w-full h-[600px] rounded-b-lg"
                src={previewUrl || "about:blank"}
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assistant;