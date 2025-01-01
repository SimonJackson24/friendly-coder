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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Github, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const [githubUrl, setGithubUrl] = useState("");
  const [importType, setImportType] = useState<"file" | "github">("file");

  const importProject = useMutation({
    mutationFn: async () => {
      if (importType === "file") {
        if (!file || !projectName.trim()) {
          throw new Error("Please provide a project name and select a file");
        }

        console.log("Importing project from file:", { projectName, fileName: file.name });

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
      } else {
        if (!githubUrl.trim() || !projectName.trim()) {
          throw new Error("Please provide a project name and GitHub repository URL");
        }

        console.log("Importing project from GitHub:", { projectName, githubUrl });

        // Create the project first
        const { data: project, error: projectError } = await supabase
          .from("projects")
          .insert({
            title: projectName,
            description: `Imported from GitHub: ${githubUrl}`,
            status: "active",
            user_id: userId,
            github_url: githubUrl,
          })
          .select()
          .single();

        if (projectError) {
          console.error("Error creating project:", projectError);
          throw projectError;
        }

        // Fetch repository contents using the Edge Function
        const response = await supabase.functions.invoke('project-operations', {
          body: { 
            operation: 'github-import',
            data: { 
              repoUrl: githubUrl,
              projectName
            }
          }
        });

        if (response.error) throw response.error;

        // Create files in the project
        const { error: filesError } = await supabase.from("files").insert(
          response.data.files.map((file: any) => ({
            project_id: project.id,
            name: file.name,
            path: file.path,
            content: file.content,
            type: "file",
          }))
        );

        if (filesError) {
          console.error("Error creating files:", filesError);
          throw filesError;
        }

        return project;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      onOpenChange(false);
      setProjectName("");
      setFile(null);
      setGithubUrl("");
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Import Project</DialogTitle>
        </DialogHeader>
        
        <Tabs value={importType} onValueChange={(value) => setImportType(value as "file" | "github")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="file" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              File Import
            </TabsTrigger>
            <TabsTrigger value="github" className="flex items-center gap-2">
              <Github className="h-4 w-4" />
              GitHub Import
            </TabsTrigger>
          </TabsList>

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

            <TabsContent value="file" className="space-y-4">
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
            </TabsContent>

            <TabsContent value="github" className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="githubUrl" className="text-sm font-medium">
                  GitHub Repository URL
                </label>
                <Input
                  id="githubUrl"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/username/repository"
                />
              </div>
              <Alert>
                <AlertDescription>
                  Enter the URL of a public GitHub repository to import its contents.
                </AlertDescription>
              </Alert>
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => importProject.mutate()}
            disabled={
              importProject.isPending || 
              !projectName.trim() || 
              (importType === "file" ? !file : !githubUrl.trim())
            }
            className="gap-2"
          >
            {importProject.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : importType === "file" ? (
              <Upload className="h-4 w-4" />
            ) : (
              <Github className="h-4 w-4" />
            )}
            Import Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};