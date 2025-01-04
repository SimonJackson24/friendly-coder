import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FileNode } from "@/hooks/useFileSystem";
import { Label } from "@/components/ui/label";

interface CreateCommitDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  branchId: string;
  files: FileNode[];
  onCommitCreated?: () => void;
}

export function CreateCommitDialog({ 
  isOpen, 
  onOpenChange, 
  branchId,
  files,
  onCommitCreated 
}: CreateCommitDialogProps) {
  const [commitMessage, setCommitMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!commitMessage.trim()) {
      toast({
        title: "Error",
        description: "Please enter a commit message",
        variant: "destructive",
      });
      return;
    }

    if (selectedFiles.size === 0) {
      toast({
        title: "Error",
        description: "Please select at least one file",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log("Creating commit:", {
        branchId,
        message: commitMessage,
        files: Array.from(selectedFiles),
      });

      const { data: commit, error: commitError } = await supabase
        .from("commits")
        .insert({
          branch_id: branchId,
          message: commitMessage,
        })
        .select()
        .single();

      if (commitError) throw commitError;

      // Create commit changes for each selected file
      const commitChanges = Array.from(selectedFiles).map(fileId => ({
        commit_id: commit.id,
        file_path: files.find(f => f.id === fileId)?.path || "",
        content: files.find(f => f.id === fileId)?.content || "",
        change_type: "modified",
      }));

      const { error: changesError } = await supabase
        .from("commit_changes")
        .insert(commitChanges);

      if (changesError) throw changesError;

      toast({
        title: "Success",
        description: "Changes committed successfully",
      });

      onCommitCreated?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating commit:", error);
      toast({
        title: "Error",
        description: "Failed to create commit",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFile = (fileId: string) => {
    const newSelectedFiles = new Set(selectedFiles);
    if (newSelectedFiles.has(fileId)) {
      newSelectedFiles.delete(fileId);
    } else {
      newSelectedFiles.add(fileId);
    }
    setSelectedFiles(newSelectedFiles);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create Commit</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Commit Message</Label>
            <Textarea
              placeholder="Enter a descriptive commit message..."
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Select Files</Label>
            <ScrollArea className="h-[200px] border rounded-md p-2">
              <div className="space-y-2">
                {files.map((file) => (
                  <div key={file.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={file.id}
                      checked={selectedFiles.has(file.id)}
                      onCheckedChange={() => toggleFile(file.id)}
                    />
                    <label
                      htmlFor={file.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {file.path}
                    </label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Commit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}