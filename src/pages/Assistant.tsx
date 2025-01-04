import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useFileSystem, FileNode } from "@/hooks/useFileSystem";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { StudioLayout } from "@/modules/ai-studio/components/layout/StudioLayout";

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
    <StudioLayout
      files={files}
      isLoading={isLoading}
      selectedFile={selectedFile}
      projectId={projectId}
      consoleOutput={consoleOutput}
      buildErrors={buildErrors}
      project={project}
      onFileSelect={handleFileSelect}
      onCreateFile={handleCreateFile}
      onDeleteFile={handleDeleteFile}
      onSaveFile={handleSaveFile}
      onClearConsole={handleClearConsole}
    />
  );
};

export default Assistant;