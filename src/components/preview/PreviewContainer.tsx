import { FileNode } from "@/hooks/useFileSystem";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Preview } from "./Preview";
import { usePreviewState } from "./usePreviewState";

interface PreviewContainerProps {
  files: FileNode[];
  onConsoleMessage: (message: string) => void;
  onConsoleError: (error: string) => void;
  projectId?: string | null;
}

export function PreviewContainer({ 
  files, 
  onConsoleMessage, 
  onConsoleError, 
  projectId 
}: PreviewContainerProps) {
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
    iframeRef,
    buildState,
    lastSuccessfulState,
    errorMessage,
    handleMessage
  } = usePreviewState(onConsoleMessage, onConsoleError);

  return (
    <Preview
      files={files}
      project={project}
      iframeRef={iframeRef}
      buildState={buildState}
      lastSuccessfulState={lastSuccessfulState}
      errorMessage={errorMessage}
      onMessage={handleMessage}
    />
  );
}