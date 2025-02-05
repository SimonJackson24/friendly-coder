import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Archive, Edit, Trash2, GitFork } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  status: "active" | "archived";
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ProjectCard({ id, title, description, status, onEdit, onDelete }: ProjectCardProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const session = useSession();

  const handleOpenProject = () => {
    console.log("Opening project:", id);
    // Remove any trailing colons and ensure proper URL formatting
    const projectUrl = `/assistant?projectId=${id}`;
    navigate(projectUrl);
  };

  const forkProject = useMutation({
    mutationFn: async () => {
      if (!session?.user?.id) {
        console.error("Fork attempt without user session");
        throw new Error("You must be logged in to fork a project");
      }

      console.log("Initiating project fork:", { projectId: id, userId: session.user.id });
      
      // First, get the project details
      const { data: projectData, error: fetchError } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) {
        console.error("Error fetching project for fork:", fetchError);
        throw new Error("Failed to fetch project details");
      }

      // Create new project as a fork
      const { data: newProject, error: createError } = await supabase
        .from("projects")
        .insert({
          title: `${projectData.title} (Fork)`,
          description: projectData.description || "Forked project",
          status: "active",
          forked_from: id,
          user_id: session.user.id,
          github_url: projectData.github_url,
          supabase_url: projectData.supabase_url,
          is_template: false
        })
        .select()
        .single();

      if (createError) {
        console.error("Error creating forked project:", createError);
        throw new Error("Failed to create forked project");
      }

      console.log("Project forked successfully:", newProject);

      // Copy all files from original project to the new fork
      const { data: originalFiles, error: filesError } = await supabase
        .from("files")
        .select("*")
        .eq("project_id", id);

      if (filesError) {
        console.error("Error fetching original files:", filesError);
        throw new Error("Failed to fetch original files");
      }

      if (originalFiles.length > 0) {
        const newFiles = originalFiles.map(file => ({
          ...file,
          id: undefined,
          project_id: newProject.id,
          created_at: undefined,
          updated_at: undefined
        }));

        const { error: copyError } = await supabase
          .from("files")
          .insert(newFiles);

        if (copyError) {
          console.error("Error copying files to forked project:", copyError);
          throw new Error("Failed to copy project files");
        }

        console.log("Files copied successfully to forked project");
      }

      return newProject;
    },
    onSuccess: (newProject) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({
        title: "Success",
        description: "Project forked successfully",
      });
      navigate(`/assistant?projectId=${newProject.id}`);
    },
    onError: (error: Error) => {
      console.error("Fork project error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to fork project",
        variant: "destructive",
      });
    },
  });

  return (
    <Card className="p-4">
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <div className="flex gap-2">
            {onEdit && (
              <Button variant="ghost" size="icon" onClick={onEdit}>
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button variant="ghost" size="icon" onClick={onDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => forkProject.mutate()}
              disabled={forkProject.isPending}
            >
              <GitFork className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={handleOpenProject}>
            Open Project
          </Button>
          <span className="text-sm text-muted-foreground capitalize">{status}</span>
        </div>
      </div>
    </Card>
  );
}