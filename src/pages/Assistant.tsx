import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ChatInterface } from "@/components/ChatInterface";
import { FileExplorer } from "@/components/FileExplorer";
import { FileEditor } from "@/components/FileEditor";
import { useFileSystem, FileNode } from "@/hooks/useFileSystem";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectSettings } from "@/components/ProjectSettings";
import { Console } from "@/components/Console";
import { Preview } from "@/components/Preview";
import { Github } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";

const Assistant = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId");
  const { toast } = useToast();
  const navigate = useNavigate();
  const session = useSession();
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [buildErrors, setBuildErrors] = useState<string[]>([]);

  // Check authentication status
  useEffect(() => {
    console.log("Checking authentication status:", session);
    if (!session) {
      console.log("No session found, redirecting to login");
      navigate("/login");
      return;
    }
  }, [session, navigate]);

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
        throw error;
      }

      console.log("Project details fetched:", data);
      return data;
    },
    enabled: !!projectId && !!session,
  });

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
    
    const path = name;
    createFile.mutate({ name, path, type });
  };

  const handleDeleteFile = (id: string) => {
    deleteFile.mutate(id);
  };

  const handleSaveFile = (id: string, content: string) => {
    updateFile.mutate({ id, content });
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

  const handleClearConsole = () => {
    setConsoleOutput([]);
    setBuildErrors([]);
  };

  // If not authenticated, don't render anything
  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Files</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={handleGitHubConnect}
              >
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
            </div>
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
                  projectId={projectId}
                />
              </TabsContent>
              
              <TabsContent value="console" className="mt-4">
                <Console 
                  logs={consoleOutput} 
                  errors={buildErrors}
                  onClear={handleClearConsole} 
                />
              </TabsContent>
              
              <TabsContent value="settings" className="mt-4">
                <ProjectSettings project={project} />
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="col-span-4">
            <Preview
              files={files}
              onConsoleMessage={(message) => setConsoleOutput(prev => [...prev, message])}
              onConsoleError={(error) => setBuildErrors(prev => [...prev, error])}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assistant;
