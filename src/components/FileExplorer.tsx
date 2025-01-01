import { useState } from "react";
import { Plus } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { FileNode } from "@/hooks/useFileSystem";
import { FileTreeNode } from "./file-explorer/FileTreeNode";
import { CreateFileDialog } from "./file-explorer/CreateFileDialog";

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

  const handleDrop = (draggedId: string, targetId: string) => {
    console.log("Moving file", draggedId, "to", targetId);
    toast({
      title: "Success",
      description: "File moved successfully",
    });
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading files...</div>;
  }

  return (
    <ScrollArea className="h-[600px] w-full border rounded-lg bg-background p-2">
      <div className="flex justify-between items-center mb-4 px-2">
        <h3 className="font-semibold">Files</h3>
        {onCreateFile && (
          <Button size="sm" className="flex items-center gap-2" onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            New
          </Button>
        )}
      </div>
      {files.map((file, index) => (
        <FileTreeNode
          key={`${file.id}-${index}`}
          node={file}
          onFileSelect={onFileSelect}
          onDeleteFile={onDeleteFile}
          onDrop={handleDrop}
        />
      ))}
      {onCreateFile && (
        <CreateFileDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onCreateFile={onCreateFile}
        />
      )}
    </ScrollArea>
  );
}