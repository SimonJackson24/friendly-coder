import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Bug, Rocket, Database, LayoutDashboard, GitBranch, GitPullRequest, Calendar, Tag } from "lucide-react";
import { CreateCommitDialog } from "./CreateCommitDialog";
import { BranchProtectionRules } from "./branch-protection/BranchProtectionRules";
import { RebaseOperations } from "./rebase/RebaseOperations";
import { CherryPick } from "./cherry-pick/CherryPick";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { FileNode } from "@/hooks/useFileSystem";
import { supabase } from "@/integrations/supabase/client";
import { RepositorySection } from "./features/RepositorySection";
import { BranchSection } from "./features/BranchSection";
import { CommitSection } from "./features/CommitSection";
import { PullRequestSection } from "./features/PullRequestSection";
import { KanbanBoard } from "./kanban/KanbanBoard";
import { MilestoneSection } from "./features/MilestoneSection";
import { ReleaseSection } from "./features/ReleaseSection";

export function VersionControl({ projectId }: { projectId: string | null }) {
  const [selectedRepositoryId, setSelectedRepositoryId] = useState<string | null>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [targetBranchId, setTargetBranchId] = useState<string | null>(null);
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
      
      setActiveBranchId(branchId);
      setSelectedBranchId(branchId);
      
      if (!targetBranchId) {
        const { data: defaultBranch } = await supabase
          .from("branches")
          .select("id")
          .eq("repository_id", selectedRepositoryId)
          .eq("is_default", true)
          .single();

        if (defaultBranch) {
          setTargetBranchId(defaultBranch.id);
        }
      }
      
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
            Please select a project to manage AI Studio version control.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-black/75 backdrop-blur-md border-white/10">
      <Tabs defaultValue="repositories" className="space-y-4">
        <TabsList className="w-full">
          <TabsTrigger value="repositories">Repositories</TabsTrigger>
          <TabsTrigger value="branches">Branches</TabsTrigger>
          <TabsTrigger value="commits">Commits</TabsTrigger>
          <TabsTrigger value="pull-requests">Pull Requests</TabsTrigger>
          <TabsTrigger value="board">Project Board</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="releases">Releases</TabsTrigger>
          <TabsTrigger value="protection">Branch Protection</TabsTrigger>
          <TabsTrigger value="rebase">Rebase</TabsTrigger>
          <TabsTrigger value="cherry-pick">Cherry Pick</TabsTrigger>
        </TabsList>

        <TabsContent value="repositories">
          <RepositorySection 
            projectId={projectId} 
            onSelectRepository={setSelectedRepositoryId}
          />
        </TabsContent>

        <TabsContent value="branches">
          <BranchSection 
            repositoryId={selectedRepositoryId}
            onSelectBranch={handleBranchSelect}
            activeBranchId={activeBranchId}
            onCreateCommit={() => setIsCommitDialogOpen(true)}
          />
        </TabsContent>

        <TabsContent value="commits">
          <CommitSection branchId={selectedBranchId} />
        </TabsContent>

        <TabsContent value="pull-requests">
          <PullRequestSection 
            repositoryId={selectedRepositoryId}
            activeBranchId={activeBranchId}
            targetBranchId={targetBranchId}
          />
        </TabsContent>

        <TabsContent value="board">
          <KanbanBoard repositoryId={selectedRepositoryId} />
        </TabsContent>

        <TabsContent value="milestones">
          <MilestoneSection repositoryId={selectedRepositoryId} />
        </TabsContent>

        <TabsContent value="releases">
          <ReleaseSection repositoryId={selectedRepositoryId} />
        </TabsContent>

        <TabsContent value="protection">
          {selectedBranchId && selectedRepositoryId ? (
            <BranchProtectionRules
              branchId={selectedBranchId}
              repositoryId={selectedRepositoryId}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Select a branch to manage protection rules
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="rebase">
          {activeBranchId && targetBranchId ? (
            <RebaseOperations
              sourceBranchId={activeBranchId}
              targetBranchId={targetBranchId}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Select source and target branches to perform rebase operations
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="cherry-pick">
          {selectedBranchId ? (
            <CherryPick
              commits={[]}
              onCherryPick={async (commitIds) => {
                console.log("Cherry-picking commits:", commitIds);
              }}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Select a branch to cherry-pick commits
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
