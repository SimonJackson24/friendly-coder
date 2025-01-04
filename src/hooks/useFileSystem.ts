import { useFileQueries } from "./file-system/useFileQueries";
import { useFileMutations } from "./file-system/useFileMutations";
import { useState } from "react";

export interface FileNode {
  id: string;
  name: string;
  type: "file" | "folder";
  path: string;
  content?: string;
  children?: FileNode[];
}

export function useFileSystem(projectId: string | null) {
  const { files, isLoading } = useFileQueries(projectId);
  const { createFile: createFileMutation, updateFile, deleteFile: deleteFileMutation, moveFile } = useFileMutations(projectId);
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);

  const selectFile = (file: FileNode) => {
    console.log("Selecting file:", file);
    setSelectedFile(file);
  };

  const createFile = async (name: string, type: "file" | "folder") => {
    console.log("Creating file:", { name, type });
    try {
      await createFileMutation.mutateAsync({
        name,
        type,
        path: `/${name}`,
      });
    } catch (error) {
      console.error("Error creating file:", error);
      throw error;
    }
  };

  const deleteFile = async (id: string) => {
    console.log("Deleting file:", id);
    try {
      await deleteFileMutation.mutateAsync(id);
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  };

  const saveFile = async (file: FileNode, content: string) => {
    console.log("Saving file:", { file, content });
    try {
      await updateFile.mutateAsync({
        id: file.id,
        content,
      });
    } catch (error) {
      console.error("Error saving file:", error);
      throw error;
    }
  };

  return {
    files,
    isLoading,
    selectedFile,
    selectFile,
    createFile,
    updateFile,
    deleteFile,
    moveFile,
    saveFile,
  };
}