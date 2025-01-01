import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useFileSystem, FileNode } from "@/hooks/useFileSystem";
import { useToast } from "@/components/ui/use-toast";
import { Preview } from "@/components/Preview";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { FileExplorerSection } from "@/components/assistant/FileExplorerSection";
import { MainContent } from "@/components/assistant/MainContent";

const Assistant = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId");
  const { toast } = useToast();
  const navigate = useNavigate();
  const session = useSession();
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [buildErrors, setBuildErrors] = useState<string[]>([]);

  useEffect(() => {
    if (!session) {
      console.log("No session found, redirecting to login");
      navigate("/login");
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

  const handleClearConsole = () => {
    setConsoleOutput([]);
    setBuildErrors([]);
  };

  if (!session) {
    return null;
  }

  return (
    <div className="h-screen w-full bg-gradient-to-br from-background to-muted overflow-hidden">
      <div className="h-full grid grid-cols-12 gap-4 p-2 md:p-4">
        <div className="col-span-12 md:col-span-3 h-full">
          <FileExplorerSection
            files={files}
            isLoading={isLoading}
            onFileSelect={handleFileSelect}
            onCreateFile={handleCreateFile}
            onDeleteFile={handleDeleteFile}
          />
        </div>
        
        <div className="col-span-12 md:col-span-5 h-full">
          <MainContent
            projectId={projectId}
            selectedFile={selectedFile}
            consoleOutput={consoleOutput}
            buildErrors={buildErrors}
            onSaveFile={handleSaveFile}
            onClearConsole={handleClearConsole}
            project={project}
          />
        </div>
        
        <div className="col-span-12 md:col-span-4 h-full">
          <Preview
            files={files}
            onConsoleMessage={(message) => setConsoleOutput(prev => [...prev, message])}
            onConsoleError={(error) => setBuildErrors(prev => [...prev, error])}
          />
        </div>
      </div>
    </div>
  );
};

export default Assistant;