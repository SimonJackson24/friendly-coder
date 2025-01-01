import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface FileEditorProps {
  file: {
    name: string;
    content?: string;
  } | null;
}

export function FileEditor({ file }: FileEditorProps) {
  const [content, setContent] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (file?.content) {
      setContent(file.content);
    }
  }, [file]);

  const handleSave = () => {
    // Implement save functionality
    toast({
      title: "Save Changes",
      description: "File saving functionality coming soon",
    });
  };

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
        <h2 className="text-lg font-semibold">{file.name}</h2>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="font-mono h-[500px]"
      />
    </Card>
  );
}