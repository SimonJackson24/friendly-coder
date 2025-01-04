import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useFileSystem, FileNode } from "@/hooks/useFileSystem";
import { StudioLayout } from "@/modules/ai-studio/components/layout/StudioLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function Assistant() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId");
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [buildErrors, setBuildErrors] = useState<string[]>([]);
  
  const { data: project } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      if (!projectId) return null;
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!projectId
  });

  const {
    files,
    selectedFile,
    isLoading,
    selectFile,
    createFile,
    deleteFile,
    saveFile,
  } = useFileSystem(projectId);

  const handleClearConsole = () => {
    setConsoleOutput([]);
    setBuildErrors([]);
  };

  const handleSaveFile = (id: string, content: string) => {
    if (!selectedFile) return;
    saveFile(selectedFile, content);
  };

  useEffect(() => {
    console.log("Assistant page mounted with projectId:", projectId);
  }, [projectId]);

  return (
    <StudioLayout
      files={files}
      isLoading={isLoading}
      selectedFile={selectedFile}
      projectId={projectId}
      consoleOutput={consoleOutput}
      buildErrors={buildErrors}
      project={project}
      onFileSelect={selectFile}
      onCreateFile={createFile}
      onDeleteFile={deleteFile}
      onSaveFile={handleSaveFile}
      onClearConsole={handleClearConsole}
    />
  );
}