import { useFileQueries } from "./file-system/useFileQueries";
import { useFileMutations } from "./file-system/useFileMutations";

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
  const { createFile, updateFile, deleteFile, moveFile } = useFileMutations(projectId);

  return {
    files,
    isLoading,
    createFile,
    updateFile,
    deleteFile,
    moveFile,
  };
}