import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { FileNode } from "@/hooks/useFileSystem";
import Editor from "@monaco-editor/react";

interface FileEditorProps {
  file: FileNode | null;
  onSave?: (id: string, content: string) => void;
}

export function FileEditor({ file, onSave }: FileEditorProps) {
  const [content, setContent] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (file?.content) {
      setContent(file.content);
      setOriginalContent(file.content);
    }
  }, [file]);

  const handleSave = () => {
    if (!file) return;
    
    try {
      onSave?.(file.id, content);
      setOriginalContent(content);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save file",
        variant: "destructive",
      });
    }
  };

  const getLanguage = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js':
      case 'jsx':
        return 'javascript';
      case 'ts':
      case 'tsx':
        return 'typescript';
      case 'html':
        return 'html';
      case 'css':
        return 'css';
      case 'json':
        return 'json';
      default:
        return 'plaintext';
    }
  };

  const hasChanges = content !== originalContent;

  if (!file) {
    return (
      <Card className="p-4">
        <p className="text-muted-foreground">Select a file to edit</p>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">{file.name}</h2>
          {hasChanges && (
            <span className="text-sm text-yellow-500">
              (Unsaved changes)
            </span>
          )}
        </div>
        <Button 
          onClick={handleSave}
          disabled={!hasChanges}
        >
          Save Changes
        </Button>
      </div>
      <Editor
        height="500px"
        language={getLanguage(file.name)}
        value={content}
        onChange={(value) => setContent(value || "")}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
        }}
      />
    </Card>
  );
}