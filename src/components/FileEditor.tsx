import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { FileNode } from "@/hooks/useFileSystem";

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
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="font-mono h-[500px]"
      />
    </Card>
  );
}