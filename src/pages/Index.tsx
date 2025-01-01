import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";
import { ProjectList } from "@/components/projects/ProjectList";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const session = useSession();
  const navigate = useNavigate();

  console.log("Auth state:", session ? "User logged in" : "No user");

  useEffect(() => {
    if (!session) {
      console.log("No session found, redirecting to login");
      navigate("/login");
    }
  }, [session, navigate]);

  const handleCreateProject = () => {
    if (!session?.user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a project.",
        variant: "destructive",
      });
      return;
    }
    setIsCreateDialogOpen(true);
  };

  if (!session?.user) {
    return null; // Don't render anything while redirecting
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

      <ProjectList userId={session.user.id} />

      <CreateProjectDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        userId={session.user.id}
      />
    </div>
  );
};

export default Index;