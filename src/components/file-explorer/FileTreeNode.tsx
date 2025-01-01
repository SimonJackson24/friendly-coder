import { useState } from "react";
import { ChevronRight, ChevronDown, File, Folder, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileNode } from "@/hooks/useFileSystem";

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
}