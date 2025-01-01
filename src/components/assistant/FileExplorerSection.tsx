import { useState } from "react";
import { FileExplorer } from "@/components/FileExplorer";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight, ChevronDown } from "lucide-react";
import { FileNode } from "@/hooks/useFileSystem";

interface FileExplorerSectionProps {
  files: FileNode[];
  isLoading: boolean;
  onFileSelect: (file: FileNode) => void;
  onCreateFile: (name: string, type: "file" | "folder") => void;
  onDeleteFile: (id: string) => void;
}

export function FileExplorerSection({
  files,
  isLoading,
  onFileSelect,
  onCreateFile,
  onDeleteFile,
}: FileExplorerSectionProps) {
  const [isFileExplorerOpen, setIsFileExplorerOpen] = useState(true);

  return (
    <Collapsible 
      open={isFileExplorerOpen} 
      onOpenChange={setIsFileExplorerOpen}
      className="h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">Files</h3>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            {isFileExplorerOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="flex-grow overflow-hidden">
        <FileExplorer
          files={files}
          onFileSelect={onFileSelect}
          onCreateFile={onCreateFile}
          onDeleteFile={onDeleteFile}
          isLoading={isLoading}
        />
      </CollapsibleContent>
    </Collapsible>
  );
}