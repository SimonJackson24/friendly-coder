import { useState } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@supabase/auth-helpers-react";

interface Project {
  id: string;
  title: string;
  description: string | null;
  status: "active" | "archived";
}

const Index = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({ title: "", description: "" });
  const user = useAuth();

  console.log("Auth state:", user ? "User logged in" : "No user");

  // Fetch projects
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
    enabled: !!user,
  });

  // Create project mutation
  const createProject = useMutation({
    mutationFn: async (projectData: { title: string; description: string }) => {
      console.log("Creating project:", projectData);
      const { data, error } = await supabase.from("projects").insert([
        {
          title: projectData.title,
          description: projectData.description,
          status: "active",
          user_id: user?.id,
        },
      ]);

      if (error) {
        console.error("Error creating project:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setIsCreateDialogOpen(false);
      setNewProject({ title: "", description: "" });
      toast({
        title: "Success",
        description: "Project created successfully",
      });
    },
    onError: (error) => {
      console.error("Project creation error:", error);
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete project mutation
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

  const handleCreateProject = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a project.",
        variant: "destructive",
      });
      return;
    }
    setIsCreateDialogOpen(true);
  };

  const handleSubmitProject = () => {
    if (!newProject.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Project title is required",
        variant: "destructive",
      });
      return;
    }
    createProject.mutate(newProject);
  };

  if (!user) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome to Project Manager</h1>
          <p className="text-muted-foreground">Please sign in to manage your projects.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Projects</h1>
        <Button onClick={handleCreateProject} className="gap-2">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center">Loading projects...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
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
      )}

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                value={newProject.title}
                onChange={(e) =>
                  setNewProject((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Enter project title"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                value={newProject.description}
                onChange={(e) =>
                  setNewProject((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Enter project description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitProject}>Create Project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;