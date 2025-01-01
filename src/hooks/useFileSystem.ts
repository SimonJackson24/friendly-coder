import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface FileNode {
  id: string;
  name: string;
  type: "file" | "folder";
  path: string;
  content?: string;
  children?: FileNode[];
}

export function useFileSystem(projectId: string | null) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const createFile = useMutation({
    mutationFn: async ({ name, path, type, content = "" }: Partial<FileNode>) => {
      console.log("Creating file:", { name, path, type, content });
      if (!projectId) throw new Error("No project selected");

      const { data, error } = await supabase
        .from("files")
        .insert({
          project_id: projectId,
          name: name!,
          path: path!,
          type: type!,
          content,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating file:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files", projectId] });
      toast({
        title: "Success",
        description: "File created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create file",
        variant: "destructive",
      });
    },
  });

  const updateFile = useMutation({
    mutationFn: async ({ id, content, path }: { id: string; content?: string; path?: string }) => {
      console.log("Updating file:", { id, content, path });
      const updateData: { content?: string; path?: string } = {};
      if (content !== undefined) updateData.content = content;
      if (path !== undefined) updateData.path = path;

      const { data, error } = await supabase
        .from("files")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating file:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files", projectId] });
      toast({
        title: "Success",
        description: "File updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update file",
        variant: "destructive",
      });
    },
  });

  const deleteFile = useMutation({
    mutationFn: async (id: string) => {
      console.log("Deleting file:", id);
      const { error } = await supabase
        .from("files")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting file:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files", projectId] });
      toast({
        title: "Success",
        description: "File deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete file",
        variant: "destructive",
      });
    },
  });

  const moveFile = useMutation({
    mutationFn: async ({ fileId, newPath }: { fileId: string; newPath: string }) => {
      console.log("Moving file:", { fileId, newPath });
      const { data, error } = await supabase
        .from("files")
        .update({ path: newPath })
        .eq("id", fileId)
        .select()
        .single();

      if (error) {
        console.error("Error moving file:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files", projectId] });
      toast({
        title: "Success",
        description: "File moved successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to move file",
        variant: "destructive",
      });
    },
  });

  return {
    files,
    isLoading,
    createFile,
    updateFile,
    deleteFile,
    moveFile,
  };
}

// Helper function to build file tree from flat array
function buildFileTree(files: any[]): FileNode[] {
  const tree: FileNode[] = [];
  const map = new Map<string, FileNode>();

  // First pass: create all nodes
  files.forEach((file) => {
    const node: FileNode = {
      id: file.id,
      name: file.name,
      type: file.type,
      path: file.path,
      content: file.content,
      children: [],
    };
    map.set(file.path, node);

    // If it's a root level item, add it to the tree
    if (!file.path.includes("/")) {
      tree.push(node);
    }
  });

  // Second pass: build relationships
  files.forEach((file) => {
    if (file.path.includes("/")) {
      const parentPath = file.path.substring(0, file.path.lastIndexOf("/"));
      const parent = map.get(parentPath);
      const node = map.get(file.path);
      if (parent && node) {
        parent.children?.push(node);
      }
    }
  });

  return tree;
}