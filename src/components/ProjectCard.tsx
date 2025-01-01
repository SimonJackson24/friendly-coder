import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, ExternalLink, GitFork } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  status: "active" | "archived";
  onEdit: () => void;
  onDelete: () => void;
}

export const ProjectCard = ({ id, title, description, status, onEdit, onDelete }: ProjectCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleOpenProject = () => {
    console.log("Opening project:", id);
    navigate(`/assistant?projectId=${id}`);
  };

  const forkProject = useMutation({
    mutationFn: async () => {
      console.log("Forking project:", id);
      
      // First, get the project details
      const { data: projectData, error: fetchError } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      // Create new project as a fork
      const { data: newProject, error: createError } = await supabase
        .from("projects")
        .insert([{
          title: `${projectData.title} (Fork)`,
          description: projectData.description,
          status: "active",
          forked_from: id
        }])
        .select()
        .single();

      if (createError) throw createError;

      // Copy all files from the original project
      const { data: files, error: filesError } = await supabase
        .from("files")
        .select("*")
        .eq("project_id", id);

      if (filesError) throw filesError;

      if (files && files.length > 0) {
        const newFiles = files.map(file => ({
          ...file,
          id: undefined,
          project_id: newProject.id,
          created_at: undefined,
          updated_at: undefined
        }));

        const { error: copyError } = await supabase
          .from("files")
          .insert(newFiles);

        if (copyError) throw copyError;
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
    onError: (error) => {
      console.error("Error forking project:", error);
      toast({
        title: "Error",
        description: "Failed to fork project. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <Card className="w-full bg-card hover:bg-card/90 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <Badge variant="outline" className={status === "active" ? "bg-green-500/10 text-green-500" : "bg-gray-500/10 text-gray-500"}>
          {status}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={onEdit}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={onDelete} className="text-destructive hover:bg-destructive/10">
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => forkProject.mutate()} disabled={forkProject.isPending}>
            <GitFork className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="outline" className="gap-2" onClick={handleOpenProject}>
          <ExternalLink className="h-4 w-4" />
          Open Project
        </Button>
      </CardFooter>
    </Card>
  );
};