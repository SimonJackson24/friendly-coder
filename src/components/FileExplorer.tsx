import { useState } from "react";
import { ChevronRight, ChevronDown, File, Folder } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";

interface FileNode {
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
  content?: string;
}

interface FileExplorerProps {
  files: FileNode[];
  onFileSelect: (file: FileNode) => void;
}

const FileTreeNode = ({ 
  node, 
  level = 0,
  onFileSelect 
}: { 
  node: FileNode; 
  level?: number;
  onFileSelect: (file: FileNode) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    if (node.type === "folder") {
      setIsExpanded(!isExpanded);
    } else {
      onFileSelect(node);
    }
  };

  return (
    <div className="select-none">
      <Button
        variant="ghost"
        className={`w-full justify-start pl-${level * 4} hover:bg-accent`}
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
      {node.type === "folder" && isExpanded && node.children && (
        <div>
          {node.children.map((child, index) => (
            <FileTreeNode
              key={`${child.name}-${index}`}
              node={child}
              level={level + 1}
              onFileSelect={onFileSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export function FileExplorer({ files, onFileSelect }: FileExplorerProps) {
  return (
    <ScrollArea className="h-[600px] w-full border rounded-lg bg-background p-2">
      {files.map((file, index) => (
        <FileTreeNode
          key={`${file.name}-${index}`}
          node={file}
          onFileSelect={onFileSelect}
        />
      ))}
    </ScrollArea>
  );
}