import { useState } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import { ChatInterface } from "@/components/ChatInterface";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Project {
  id: string;
  title: string;
  description: string;
  status: "active" | "archived";
}

const Index = () => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      title: "Example Project",
      description: "This is a mock project. Backend integration pending.",
      status: "active",
    },
  ]);

  const handleCreateProject = () => {
    toast({
      title: "Backend Integration Required",
      description: "Project creation will be implemented when backend is connected.",
    });
  };

  const handleEditProject = (id: string) => {
    toast({
      title: "Backend Integration Required",
      description: "Project editing will be implemented when backend is connected.",
    });
  };

  const handleDeleteProject = (id: string) => {
    toast({
      title: "Backend Integration Required",
      description: "Project deletion will be implemented when backend is connected.",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Projects</h1>
          <Button onClick={handleCreateProject} className="gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              description={project.description}
              status={project.status}
              onEdit={() => handleEditProject(project.id)}
              onDelete={() => handleDeleteProject(project.id)}
            />
          ))}
        </div>
        <div className="h-[500px]">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
};

export default Index;