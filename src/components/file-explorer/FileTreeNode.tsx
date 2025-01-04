import { useState } from "react";
import { ChevronRight, ChevronDown, File, Folder, FolderOpen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileNode } from "@/hooks/useFileSystem";
import { cn } from "@/lib/utils";

interface FileTreeNodeProps {
  node: FileNode;
  level?: number;
  onFileSelect: (file: FileNode) => void;
  onDeleteFile?: (id: string) => void;
  onDrop?: (draggedId: string, targetId: string) => void;
}

export function FileTreeNode({ 
  node, 
  level = 0,
  onFileSelect,
  onDeleteFile,
  onDrop,
}: FileTreeNodeProps) {
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
        className={cn(
          "flex items-center group rounded-md transition-colors",
          isDragOver && "bg-accent/20",
          isDragging && "opacity-50"
        )}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "w-full justify-start gap-2 h-8 px-2 hover:bg-accent/20",
            level > 0 && `ml-${level * 4}`
          )}
          onClick={handleClick}
        >
          <span className="flex items-center gap-2 text-sm">
            {node.type === "folder" ? (
              <>
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
                {isExpanded ? (
                  <FolderOpen className="h-4 w-4 text-blue-400" />
                ) : (
                  <Folder className="h-4 w-4 text-blue-400" />
                )}
              </>
            ) : (
              <File className="h-4 w-4 text-muted-foreground ml-6" />
            )}
            {node.name}
          </span>
        </Button>
        {onDeleteFile && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onDeleteFile(node.id)}
          >
            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
          </Button>
        )}
      </div>
      {node.type === "folder" && isExpanded && node.children && (
        <div className="pl-4">
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
}