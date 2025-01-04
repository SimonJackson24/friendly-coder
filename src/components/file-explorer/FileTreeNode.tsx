import { useState } from "react";
import { ChevronRight, ChevronDown, File, Folder, FolderOpen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileNode } from "@/hooks/useFileSystem";
import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface FileTreeNodeProps {
  node: FileNode;
  level?: number;
  onFileSelect: (file: FileNode) => void;
  onDeleteFile: (id: string) => void;
  onMoveFile?: (sourceId: string, targetId: string) => void;
  onDrop?: (draggedId: string, targetId: string) => void;
}

export function FileTreeNode({
  node,
  level = 0,
  onFileSelect,
  onDeleteFile,
  onMoveFile,
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
    e.stopPropagation();
    setIsDragging(true);
    e.dataTransfer.setData("text/plain", node.id);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (node.type === "folder") {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (node.type !== "folder") return;

    const sourceId = e.dataTransfer.getData("text/plain");
    if (sourceId !== node.id) {
      if (onDrop) {
        onDrop(sourceId, node.id);
      } else if (onMoveFile) {
        onMoveFile(sourceId, node.id);
      }
    }
  };

  return (
    <div className="select-none" role="treeitem" aria-expanded={node.type === "folder" ? isExpanded : undefined}>
      <div 
        className={cn(
          "flex items-center group rounded-md transition-all duration-200",
          isDragOver && "bg-accent/20 scale-105",
          isDragging && "opacity-50",
          "hover:bg-accent/10"
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
            "w-full justify-start gap-2 h-8 px-2 hover:bg-accent/20 transition-colors",
            level > 0 && `ml-${level * 4}`
          )}
          onClick={handleClick}
        >
          <span className="flex items-center gap-2 text-sm">
            {node.type === "folder" ? (
              <>
                <span className="transition-transform duration-200" style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </span>
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
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteFile(node.id);
                  }}
                  aria-label={`Delete ${node.name}`}
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive transition-colors" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete {node.type}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      {node.type === "folder" && isExpanded && node.children && (
        <div 
          className="pl-4 overflow-hidden transition-all duration-200"
          role="group"
        >
          {node.children.map((child, index) => (
            <FileTreeNode
              key={`${child.id}-${index}`}
              node={child}
              level={level + 1}
              onFileSelect={onFileSelect}
              onDeleteFile={onDeleteFile}
              onMoveFile={onMoveFile}
              onDrop={onDrop}
            />
          ))}
        </div>
      )}
    </div>
  );
}