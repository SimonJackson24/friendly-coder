import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";

interface FileEditorProps {
  file: {
    name: string;
    content?: string;
  } | null;
}

export function FileEditor({ file }: FileEditorProps) {
  const [content, setContent] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (file?.content) {
      setContent(file.content);
      setOriginalContent(file.content);
    }
  }, [file]);

  const saveFileMutation = useMutation({
    mutationFn: async () => {
      // This would be replaced with your actual file save API call
      console.log("Saving file:", file?.name, content);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    },
    onSuccess: () => {
      setOriginalContent(content);
      toast({
        title: "File Saved",
        description: `Successfully saved ${file?.name}`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save file",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    saveFileMutation.mutate();
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
          disabled={!hasChanges || saveFileMutation.isPending}
        >
          {saveFileMutation.isPending ? "Saving..." : "Save Changes"}
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