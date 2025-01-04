import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RepositoryList } from "./RepositoryList";
import { BranchList } from "./BranchList";
import { CommitHistory } from "./CommitHistory";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function VersionControl({ projectId }: { projectId: string | null }) {
  const [selectedRepositoryId, setSelectedRepositoryId] = useState<string | null>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [activeBranchId, setActiveBranchId] = useState<string | null>(null);
  const { toast } = useToast();

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

        <TabsContent value="branches">
          {selectedRepositoryId ? (
            <BranchList 
              repositoryId={selectedRepositoryId}
              onSelectBranch={handleBranchSelect}
              activeBranchId={activeBranchId}
            />
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
    </Card>
  );
}