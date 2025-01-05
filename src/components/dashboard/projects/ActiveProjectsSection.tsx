import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export function ActiveProjectsSection() {
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      console.log("Fetching user projects");
      const { data: projects, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching projects:", error);
        throw error;
      }
      return projects;
    }
  });

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center p-8">
          <p className="text-red-500 mb-4">Failed to load projects</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      );
    }

    if (!projects?.length) {
      return (
        <div className="text-center p-8">
          <p className="text-muted-foreground mb-4">No active projects</p>
          <Button asChild>
            <Link to="/assistant">Create New Project</Link>
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {projects.slice(0, 5).map((project) => (
          <div 
            key={project.id} 
            className="flex items-center justify-between p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <div>
              <h3 className="font-medium">{project.title}</h3>
              <p className="text-sm text-muted-foreground">{project.description}</p>
            </div>
            <Button 
              asChild 
              variant="ghost" 
              size="sm"
            >
              <Link to={`/assistant?projectId=${project.id}`}>
                Open
              </Link>
            </Button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Active Projects</h2>
      <Card className="p-6">
        {renderContent()}
      </Card>
    </div>
  );
}