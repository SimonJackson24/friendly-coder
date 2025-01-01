import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface CreateFileDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateFile: (name: string, type: "file" | "folder") => void;
}

export function CreateFileDialog({ isOpen, onOpenChange, onCreateFile }: CreateFileDialogProps) {
  const [newFileName, setNewFileName] = useState("");
  const [fileType, setFileType] = useState<"file" | "folder">("file");
  const { toast } = useToast();

  const handleCreateFile = () => {
    if (!newFileName.trim()) {
      toast({
        title: "Error",
        description: "File name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    onCreateFile(newFileName, fileType);
    setNewFileName("");
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New File</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="fileName">Name</Label>
            <Input
              id="fileName"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder="Enter file name"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={fileType === "file" ? "default" : "outline"}
              onClick={() => setFileType("file")}
            >
              File
            </Button>
            <Button
              variant={fileType === "folder" ? "default" : "outline"}
              onClick={() => setFileType("folder")}
            >
              Folder
            </Button>
          </div>
          <Button onClick={handleCreateFile}>Create</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}