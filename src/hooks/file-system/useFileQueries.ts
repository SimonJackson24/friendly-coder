import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FileNode } from "../useFileSystem";
import { buildFileTree } from "./utils";

export function useFileQueries(projectId: string | null) {
  const { data: files = [], isLoading } = useQuery({
    queryKey: ["files", projectId],
    queryFn: async () => {
      console.log("Fetching files for project:", projectId);
      if (!projectId) return [];

      const { data, error } = await supabase
        .from("files")
        .select("*")
        .eq("project_id", projectId)
        .order("path");

      if (error) {
        console.error("Error fetching files:", error);
        throw error;
      }

      console.log("Files fetched:", data);
      return buildFileTree(data);
    },
    enabled: !!projectId,
  });

  return { files, isLoading };
}