import { useState } from "react";
import { ChevronRight, ChevronDown, File, Folder, Plus, Trash } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "./ui/use-toast";
import { FileNode } from "@/hooks/useFileSystem";

interface FileExplorerProps {
  files: FileNode[];
  onFileSelect: (file: FileNode) => void;
  onCreateFile?: (name: string, type: "file" | "folder") => void;
  onDeleteFile?: (id: string) => void;
  isLoading?: boolean;
}

const FileTreeNode = ({ 
  node, 
  level = 0,
  onFileSelect,
  onDeleteFile,
  onDrop,
}: { 
  node: FileNode; 
  level?: number;
  onFileSelect: (file: FileNode) => void;
  onDeleteFile?: (id: string) => void;
  onDrop?: (draggedId: string, targetId: string) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleClick = () => {
    if (node.type === "folder") {
      setIsExpanded(!isExpanded);
    } else {
      onFileSelect(node);
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", node.id);
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (node.type === "folder") {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const draggedId = e.dataTransfer.getData("text/plain");
    if (draggedId !== node.id && onDrop) {
      onDrop(draggedId, node.id);
    }
  };

  return (
    <div className="select-none">
      <div 
        className={`flex items-center group ${isDragOver ? 'bg-accent/50' : ''}`}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Button
          variant="ghost"
          className={`w-full justify-start pl-${level * 4} hover:bg-accent ${isDragging ? 'opacity-50' : ''}`}
          onClick={handleClick}
        >
          <span className="flex items-center gap-2">
            {node.type === "folder" ? (
              <>
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <Folder className="h-4 w-4" />
              </>
            ) : (
              <File className="h-4 w-4 ml-6" />
            )}
            {node.name}
          </span>
        </Button>
        {onDeleteFile && (
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100"
            onClick={() => onDeleteFile(node.id)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      {node.type === "folder" && isExpanded && node.children && (
        <div>
          {node.children.map((child, index) => (
            <FileTreeNode
              key={`${child.id}-${index}`}
              node={child}
              level={level + 1}
              onFileSelect={onFileSelect}
              onDeleteFile={onDeleteFile}
              onDrop={onDrop}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export function FileExplorer({ 
  files, 
  onFileSelect, 
  onCreateFile,
  onDeleteFile,
  isLoading 
}: FileExplorerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [fileType, setFileType] = useState<"file" | "folder">("file");
  const { toast } = useToast();

  const handleCreateFile = () => {
    if (!newFileName.trim()) {
      toast({
        title: "Error",
        description: "File name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    onCreateFile?.(newFileName, fileType);
    setNewFileName("");
    setIsDialogOpen(false);
  };

  const handleDrop = (draggedId: string, targetId: string) => {
    console.log("Moving file", draggedId, "to", targetId);
    // Here we would update the file path in the database
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
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New File</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fileName">Name</Label>
                  <Input
                    id="fileName"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    placeholder="Enter file name"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={fileType === "file" ? "default" : "outline"}
                    onClick={() => setFileType("file")}
                  >
                    File
                  </Button>
                  <Button
                    variant={fileType === "folder" ? "default" : "outline"}
                    onClick={() => setFileType("folder")}
                  >
                    Folder
                  </Button>
                </div>
                <Button onClick={handleCreateFile}>Create</Button>
              </div>
            </DialogContent>
          </Dialog>
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
    </ScrollArea>
  );
}