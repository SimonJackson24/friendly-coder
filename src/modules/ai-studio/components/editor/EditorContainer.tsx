import { FileEditor } from "@/components/FileEditor";
import { FileNode } from "@/hooks/useFileSystem";

interface EditorContainerProps {
  file: FileNode | null;
  onSave: (id: string, content: string) => void;
  projectId: string | null;
}

export function EditorContainer({ file, onSave, projectId }: EditorContainerProps) {
  return (
    <div className="h-full">
      <FileEditor
        file={file}
        onSave={onSave}
        projectId={projectId}
      />
    </div>
  );
}