import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RepositoryList } from "./RepositoryList";
import { BranchList } from "./BranchList";
import { CommitHistory } from "./CommitHistory";
import { CreateCommitDialog } from "./CreateCommitDialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { FileNode } from "@/hooks/useFileSystem";
import { Plus } from "lucide-react";

export function VersionControl({ projectId }: { projectId: string | null }) {
  const [selectedRepositoryId, setSelectedRepositoryId] = useState<string | null>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [activeBranchId, setActiveBranchId] = useState<string | null>(null);
  const [isCommitDialogOpen, setIsCommitDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: files = [] } = useQuery({
    queryKey: ["files", projectId],
    queryFn: async () => {
      if (!projectId) return [];
      const { data, error } = await supabase
        .from("files")
        .select("*")
        .eq("project_id", projectId);

      if (error) throw error;
      return data as FileNode[];
    },
    enabled: !!projectId,
  });

  const handleBranchSelect = async (branchId: string) => {
    try {
      console.log("Switching to branch:", branchId);
      
      // Here we would typically update the file system to reflect the selected branch
      // For now, we'll just update the active branch
      setActiveBranchId(branchId);
      setSelectedBranchId(branchId);
      
      toast({
        title: "Branch switched",
        description: "Successfully switched to the selected branch",
      });
    } catch (error) {
      console.error("Error switching branch:", error);
      toast({
        title: "Error",
        description: "Failed to switch branch",
        variant: "destructive",
      });
    }
  };

  if (!projectId) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold">No Project Selected</h2>
          <p className="text-muted-foreground">
            Please select a project to manage version control.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-black/75 backdrop-blur-md border-white/10">
      <Tabs defaultValue="repositories" className="space-y-4">
        <TabsList>
          <TabsTrigger value="repositories">Repositories</TabsTrigger>
          <TabsTrigger value="branches">Branches</TabsTrigger>
          <TabsTrigger value="commits">Commits</TabsTrigger>
        </TabsList>

        <TabsContent value="repositories">
          <RepositoryList 
            projectId={projectId} 
            onSelectRepository={setSelectedRepositoryId}
          />
        </TabsContent>

        <TabsContent value="branches" className="space-y-4">
          {selectedRepositoryId ? (
            <>
              <div className="flex justify-end">
                {activeBranchId && (
                  <Button onClick={() => setIsCommitDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Commit
                  </Button>
                )}
              </div>
              <BranchList 
                repositoryId={selectedRepositoryId}
                onSelectBranch={handleBranchSelect}
                activeBranchId={activeBranchId}
              />
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Select a repository to manage branches
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="commits">
          {selectedBranchId ? (
            <CommitHistory branchId={selectedBranchId} />
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Select a branch to view commit history
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {activeBranchId && (
        <CreateCommitDialog
          isOpen={isCommitDialogOpen}
          onOpenChange={setIsCommitDialogOpen}
          branchId={activeBranchId}
          files={files}
          onCommitCreated={() => {
            // Refresh commit history
            // This will be handled by react-query invalidation
          }}
        />
      )}
    </Card>
  );
}