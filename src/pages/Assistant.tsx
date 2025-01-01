import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChatInterface } from "@/components/ChatInterface";
import { FileExplorer } from "@/components/FileExplorer";
import { FileEditor } from "@/components/FileEditor";
import { useFileSystem, FileNode } from "@/hooks/useFileSystem";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ProjectSettings } from "@/components/ProjectSettings";
import { Console } from "@/components/Console";
import { Github } from "lucide-react";

const Assistant = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId");
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [buildErrors, setBuildErrors] = useState<string[]>([]);

  const {
    files,
    isLoading,
    createFile,
    updateFile,
    deleteFile,
  } = useFileSystem(projectId);

  const handleFileSelect = (file: FileNode) => {
    console.log("Selected file:", file);
    setSelectedFile(file);
  };

  const handleCreateFile = (name: string, type: "file" | "folder") => {
    if (!projectId) return;
    
    const path = name; // For now, create files at root level
    createFile.mutate({ name, path, type });
  };

  const handleDeleteFile = (id: string) => {
    deleteFile.mutate(id);
  };

  const handleSaveFile = (id: string, content: string) => {
    updateFile.mutate({ id, content });
  };

  const handleGitHubConnect = () => {
    if (!projectId) {
      toast({
        title: "GitHub Connection",
        description: "Please add a GitHub URL in project settings first",
        variant: "destructive",
      });
      return;
    }
    
    window.open(projectId, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-3">
            <FileExplorer
              files={files}
              onFileSelect={handleFileSelect}
              onCreateFile={handleCreateFile}
              onDeleteFile={handleDeleteFile}
              isLoading={isLoading}
            />
          </div>
          
          <div className="col-span-5">
            <Tabs defaultValue="editor" className="h-full">
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
                <FileEditor
                  file={selectedFile}
                  onSave={handleSaveFile}
                />
              </TabsContent>
              
              <TabsContent value="console" className="mt-4">
                <Console logs={consoleOutput} errors={buildErrors} />
              </TabsContent>
              
              <TabsContent value="settings" className="mt-4">
                <ProjectSettings />
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
                src="about:blank"
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
