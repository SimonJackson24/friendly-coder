import { FileNode } from "@/hooks/useFileSystem";
import { FileExplorerSection } from "@/components/assistant/FileExplorerSection";
import { Preview } from "@/components/Preview";
import { StudioTabs } from "./StudioTabs";

interface StudioLayoutProps {
  files: FileNode[];
  isLoading: boolean;
  selectedFile: FileNode | null;
  projectId: string | null;
  consoleOutput: string[];
  buildErrors: string[];
  project: any;
  onFileSelect: (file: FileNode) => void;
  onCreateFile: (name: string, type: "file" | "folder") => void;
  onDeleteFile: (id: string) => void;
  onSaveFile: (id: string, content: string) => void;
  onClearConsole: () => void;
}

export function StudioLayout({
  files,
  isLoading,
  selectedFile,
  projectId,
  consoleOutput,
  buildErrors,
  project,
  onFileSelect,
  onCreateFile,
  onDeleteFile,
  onSaveFile,
  onClearConsole,
}: StudioLayoutProps) {
  return (
    <div className="h-screen w-full bg-background">
      <div className="h-full grid grid-cols-12 gap-4 p-2 md:p-4">
        <div className="col-span-12 md:col-span-3 h-full">
          <FileExplorerSection
            files={files}
            isLoading={isLoading}
            onFileSelect={onFileSelect}
            onCreateFile={onCreateFile}
            onDeleteFile={onDeleteFile}
          />
        </div>
        
        <div className="col-span-12 md:col-span-5 h-full">
          <StudioTabs
            projectId={projectId}
            selectedFile={selectedFile}
            consoleOutput={consoleOutput}
            buildErrors={buildErrors}
            onSaveFile={onSaveFile}
            onClearConsole={onClearConsole}
            project={project}
          />
        </div>
        
        <div className="col-span-12 md:col-span-4 h-full">
          <Preview
            files={files}
            onConsoleMessage={(message) => consoleOutput.push(message)}
            onConsoleError={(error) => buildErrors.push(error)}
          />
        </div>
      </div>
    </div>
  );
}