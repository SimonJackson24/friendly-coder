import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";

interface ImportProjectDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

export const ImportProjectDialog = ({ isOpen, onOpenChange, userId }: ImportProjectDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [projectName, setProjectName] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const importProject = useMutation({
    mutationFn: async () => {
      if (!file || !projectName.trim()) {
        throw new Error("Please provide a project name and select a file");
      }

      console.log("Importing project:", { projectName, fileName: file.name });

      // First create the project
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .insert({
          title: projectName,
          description: `Imported from ${file.name}`,
          status: "active",
          user_id: userId,
        })
        .select()
        .single();

      if (projectError) {
        console.error("Error creating project:", projectError);
        throw projectError;
      }

      // Read and parse the zip file
      const fileContent = await file.text();
      let files;
      try {
        files = JSON.parse(fileContent);
      } catch (error) {
        console.error("Error parsing file:", error);
        throw new Error("Invalid file format. Please upload a valid project export file.");
      }

      // Create files in the project
      const { error: filesError } = await supabase.from("files").insert(
        files.map((file: any) => ({
          project_id: project.id,
          name: file.name,
          path: file.path,
          content: file.content,
          type: file.type,
        }))
      );

      if (filesError) {
        console.error("Error creating files:", filesError);
        throw filesError;
      }

      return project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      onOpenChange(false);
      setProjectName("");
      setFile(null);
      toast({
        title: "Success",
        description: "Project imported successfully",
      });
    },
    onError: (error: Error) => {
      console.error("Project import error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to import project",
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Project</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="projectName" className="text-sm font-medium">
              Project Name
            </label>
            <Input
              id="projectName"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="file" className="text-sm font-medium">
              Project File
            </label>
            <Input
              id="file"
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="cursor-pointer"
            />
            <p className="text-xs text-muted-foreground">
              Upload a project export file (.json)
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => importProject.mutate()}
            disabled={importProject.isPending || !file || !projectName.trim()}
            className="gap-2"
          >
            {importProject.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            Import Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};