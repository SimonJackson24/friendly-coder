import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CreateRepositoryDialog } from "./CreateRepositoryDialog";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface Repository {
  id: string;
  name: string;
  description: string | null;
  is_private: boolean;
  created_at: string;
}

interface RepositoryListProps {
  projectId: string;
  onSelectRepository: (id: string) => void;
}

export function RepositoryList({ projectId, onSelectRepository }: RepositoryListProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: repositories, isLoading } = useQuery({
    queryKey: ["repositories", projectId],
    queryFn: async () => {
      console.log("Fetching repositories for project:", projectId);
      const { data, error } = await supabase
        .from("repositories")
        .select("*")
        .eq("project_id", projectId);

      if (error) {
        console.error("Error fetching repositories:", error);
        throw error;
      }

      return data as Repository[];
    },
  });

  if (isLoading) {
    return <div>Loading repositories...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Repositories</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Repository
        </Button>
      </div>

      <ScrollArea className="h-[400px]">
        <div className="space-y-2">
          {repositories?.map((repo) => (
            <div
              key={repo.id}
              className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
              onClick={() => onSelectRepository(repo.id)}
            >
              <h3 className="font-semibold">{repo.name}</h3>
              {repo.description && (
                <p className="text-sm text-muted-foreground">{repo.description}</p>
              )}
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <span>{repo.is_private ? "Private" : "Public"}</span>
                <span>•</span>
                <span>
                  Created {new Date(repo.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <CreateRepositoryDialog
        projectId={projectId}
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
}