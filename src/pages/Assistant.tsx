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
import { GitHubActions } from "@/components/github/GitHubActions";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight, ChevronDown } from "lucide-react";

const Assistant = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId");
  const { toast } = useToast();
  const navigate = useNavigate();
  const session = useSession();
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [buildErrors, setBuildErrors] = useState<string[]>([]);
  const [isFileExplorerOpen, setIsFileExplorerOpen] = useState(true);

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

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 md:p-8">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-3">
            <Collapsible open={isFileExplorerOpen} onOpenChange={setIsFileExplorerOpen}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">Files</h3>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    {isFileExplorerOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent>
                <FileExplorer
                  files={files}
                  onFileSelect={handleFileSelect}
                  onCreateFile={handleCreateFile}
                  onDeleteFile={handleDeleteFile}
                  isLoading={isLoading}
                />
              </CollapsibleContent>
            </Collapsible>
          </div>
          
          <div className="col-span-12 md:col-span-5">
            <Tabs defaultValue="chat" className="h-full space-y-6">
              <TabsList className="w-full">
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="editor">Editor</TabsTrigger>
                <TabsTrigger value="console">Console</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="github">GitHub</TabsTrigger>
              </TabsList>
              
              <TabsContent value="chat">
                <ChatInterface projectId={projectId} />
              </TabsContent>
              
              <TabsContent value="editor">
                <FileEditor
                  file={selectedFile}
                  onSave={handleSaveFile}
                  projectId={projectId}
                />
              </TabsContent>
              
              <TabsContent value="console">
                <Console 
                  logs={consoleOutput} 
                  errors={buildErrors}
                  onClear={handleClearConsole} 
                />
              </TabsContent>
              
              <TabsContent value="settings">
                <ProjectSettings project={project} />
              </TabsContent>

              <TabsContent value="github">
                <GitHubActions />
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="col-span-12 md:col-span-4">
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
