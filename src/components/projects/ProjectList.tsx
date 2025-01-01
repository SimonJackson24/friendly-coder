import { ProjectCard } from "@/components/ProjectCard";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface Project {
  id: string;
  title: string;
  description: string | null;
  status: "active" | "archived";
}

interface ProjectListProps {
  userId: string;
}

export const ProjectList = ({ userId }: ProjectListProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      console.log("Fetching projects...");
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching projects:", error);
        throw error;
      }

      console.log("Projects fetched:", data);
      return data as Project[];
    },
    enabled: !!userId,
  });

  const deleteProject = useMutation({
    mutationFn: async (projectId: string) => {
      console.log("Deleting project:", projectId);
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId);

      if (error) {
        console.error("Error deleting project:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
    },
    onError: (error) => {
      console.error("Project deletion error:", error);
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return <div className="text-center">Loading projects...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          id={project.id}
          title={project.title}
          description={project.description || ""}
          status={project.status}
          onEdit={() => {
            toast({
              title: "Coming Soon",
              description: "Project editing will be implemented soon.",
            });
          }}
          onDelete={() => deleteProject.mutate(project.id)}
        />
      ))}
    </div>
  );
};