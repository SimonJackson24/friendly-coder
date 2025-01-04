import { BrainCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ProjectsHeaderProps {
  onCreateProject: () => void;
}

export function ProjectsHeader({ onCreateProject }: ProjectsHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div className="flex items-center gap-3">
        <BrainCog className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
            My Projects
          </h1>
          <p className="text-white/80 mt-1">
            Manage and organize your AI-powered projects
          </p>
        </div>
      </div>
      <Button 
        onClick={onCreateProject}
        size="lg"
        className="shadow-lg hover:shadow-primary/20 transition-all duration-300"
      >
        <Plus className="w-5 h-5 mr-2" />
        New Project
      </Button>
    </div>
  );
}