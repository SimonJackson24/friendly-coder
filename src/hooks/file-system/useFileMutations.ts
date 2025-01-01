import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { FileNode } from "../useFileSystem";
import Logger from "@/utils/logger";

export function useFileMutations(projectId: string | null) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createFile = useMutation({
    mutationFn: async ({ name, path, type, content = "" }: Partial<FileNode>) => {
      console.log("Creating file:", { name, path, type, content });
      if (!projectId) throw new Error("No project selected");

      Logger.logFileOperation('create', path!, { name, type, content });

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
        Logger.logBuildError(error, path);
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
      Logger.logFileOperation('update', path || id, { content });

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
        Logger.logBuildError(error, path);
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
      Logger.logFileOperation('delete', id);

      const { error } = await supabase
        .from("files")
        .delete()
        .eq("id", id);

      if (error) {
        Logger.logBuildError(error);
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
      Logger.logFileOperation('move', newPath, { fileId });

      const { data, error } = await supabase
        .from("files")
        .update({ path: newPath })
        .eq("id", fileId)
        .select()
        .single();

      if (error) {
        Logger.logBuildError(error, newPath);
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
    createFile,
    updateFile,
    deleteFile,
    moveFile,
  };
}