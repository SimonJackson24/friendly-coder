import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CreateBranchDialog } from "./CreateBranchDialog";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface Branch {
  id: string;
  name: string;
  is_default: boolean;
  created_at: string;
  repository_id: string;
}

export function BranchList({ repositoryId }: { repositoryId: string }) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: branches, isLoading } = useQuery({
    queryKey: ["branches", repositoryId],
    queryFn: async () => {
      console.log("Fetching branches for repository:", repositoryId);
      const { data, error } = await supabase
        .from("branches")
        .select("*")
        .eq("repository_id", repositoryId);

      if (error) {
        console.error("Error fetching branches:", error);
        throw error;
      }

      return data as Branch[];
    },
    enabled: !!repositoryId,
  });

  if (isLoading) {
    return <div>Loading branches...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Branches</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Branch
        </Button>
      </div>

      <ScrollArea className="h-[400px]">
        <div className="space-y-2">
          {branches?.map((branch) => (
            <div
              key={branch.id}
              className="p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{branch.name}</h3>
                  {branch.is_default && (
                    <span className="text-sm text-muted-foreground">Default branch</span>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">
                  Created {new Date(branch.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <CreateBranchDialog
        repositoryId={repositoryId}
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
}