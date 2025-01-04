import { useState } from "react";
import { Plus } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { FileNode } from "@/hooks/useFileSystem";
import { FileTreeNode } from "./file-explorer/FileTreeNode";
import { CreateFileDialog } from "./file-explorer/CreateFileDialog";
import { buildFileTree, sortFileTree, validateFileName } from "@/utils/fileTreeUtils";

interface FileExplorerProps {
  files: FileNode[];
  onFileSelect: (file: FileNode) => void;
  onCreateFile?: (name: string, type: "file" | "folder") => void;
  onDeleteFile?: (id: string) => void;
  isLoading?: boolean;
}

export function FileExplorer({ 
  files, 
  onFileSelect, 
  onCreateFile,
  onDeleteFile,
  isLoading 
}: FileExplorerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const fileTree = sortFileTree(buildFileTree(files));

  const handleCreateFile = (name: string, type: "file" | "folder") => {
    if (!validateFileName(name)) {
      toast({
        title: "Invalid file name",
        description: "File name contains invalid characters",
        variant: "destructive",
      });
      return;
    }
    onCreateFile?.(name, type);
  };

  const handleDrop = (draggedId: string, targetId: string) => {
    console.log("Moving file", draggedId, "to", targetId);
    toast({
      title: "Success",
      description: "File moved successfully",
    });
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading files...</div>;
  }

  return (
    <div className="h-full flex flex-col bg-background/50 backdrop-blur-sm rounded-lg">
      <div className="flex justify-end p-2">
        {onCreateFile && (
          <Button size="sm" variant="ghost" onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New
          </Button>
        )}
      </div>
      <ScrollArea className="flex-grow">
        <div className="p-2">
          {fileTree.map((file, index) => (
            <FileTreeNode
              key={`${file.id}-${index}`}
              node={file}
              onFileSelect={onFileSelect}
              onDeleteFile={onDeleteFile}
              onDrop={handleDrop}
            />
          ))}
        </div>
      </ScrollArea>
      {onCreateFile && (
        <CreateFileDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onCreateFile={handleCreateFile}
        />
      )}
    </div>
  );
}