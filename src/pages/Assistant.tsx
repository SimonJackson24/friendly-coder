import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ChatInterface } from "@/components/ChatInterface";
import { FileExplorer } from "@/components/FileExplorer";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { FileEditor } from "@/components/FileEditor";
import { ProjectSettings } from "@/components/ProjectSettings";
import { Console } from "@/components/Console";
import { GitHubIcon } from "lucide-react";

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
  const [files, setFiles] = useState<FileNode[]>([]);

  // Fetch project details
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

  // Fetch file system
  const { data: fileSystem } = useQuery({
    queryKey: ["files", projectId],
    queryFn: async () => {
      if (!projectId) return [];
      
      console.log("Fetching file system for project:", projectId);
      // This would be replaced with your actual file system API call
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
      
      setFiles(mockFiles);
      return mockFiles;
    },
    enabled: !!projectId,
  });

  // Save file mutation
  const saveFileMutation = useMutation({
    mutationFn: async (file: FileNode) => {
      console.log("Saving file:", file);
      // This would be replaced with your actual file save API call
      toast({
        title: "File Saved",
        description: `Successfully saved ${file.name}`,
      });
    },
  });

  // Handle build errors and console output
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'console') {
        setConsoleOutput(prev => [...prev, event.data.message]);
      } else if (event.data.type === 'error') {
        setBuildErrors(prev => [...prev, event.data.message]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleFileSelect = (file: FileNode) => {
    console.log("Selected file:", file);
    setSelectedFile(file);
  };

  const handleFileCreate = () => {
    toast({
      title: "Create File",
      description: "File creation functionality coming soon",
    });
  };

  const handleFileDelete = () => {
    if (!selectedFile) return;
    toast({
      title: "Delete File",
      description: "File deletion functionality coming soon",
    });
  };

  const handleGitHubConnect = () => {
    if (!project?.github_url) {
      toast({
        title: "GitHub Connection",
        description: "Please add a GitHub URL in project settings first",
        variant: "destructive",
      });
      return;
    }
    
    window.open(project.github_url, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {project && (
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">{project.title}</h1>
              {project.description && (
                <p className="text-muted-foreground mt-2">{project.description}</p>
              )}
            </div>
            <Button
              variant="outline"
              onClick={handleGitHubConnect}
              className="flex items-center gap-2"
            >
              <GitHubIcon className="h-4 w-4" />
              Connect to GitHub
            </Button>
          </div>
        )}
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-3">
            <Card className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Files</h2>
                <div className="space-x-2">
                  <Button size="sm" onClick={handleFileCreate}>New</Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={handleFileDelete} 
                    disabled={!selectedFile}
                  >
                    Delete
                  </Button>
                </div>
              </div>
              <FileExplorer files={files} onFileSelect={handleFileSelect} />
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