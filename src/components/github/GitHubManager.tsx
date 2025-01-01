import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GitHubExport } from "./GitHubExport";
import { GitHubImport } from "./GitHubImport";
import { GitHubActions } from "./GitHubActions";
import { GitHubBranchSelect } from "./GitHubBranchSelect";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function GitHubManager() {
  const [currentRepo, setCurrentRepo] = useState<string | null>(null);
  const [currentBranch, setCurrentBranch] = useState("main");
  const [branches, setBranches] = useState(["main", "development"]);
  const { toast } = useToast();

  const handleCreatePR = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('project-operations', {
        body: { 
          operation: 'github-create-pr',
          data: { repo: currentRepo, branch: currentBranch }
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Pull request created successfully",
      });
    } catch (error) {
      console.error('PR creation error:', error);
      toast({
        title: "Error",
        description: "Failed to create pull request",
        variant: "destructive",
      });
    }
  };

  const handleCreateBranch = async () => {
    // Implementation for creating a new branch
    toast({
      title: "Coming Soon",
      description: "Branch creation feature is under development",
    });
  };

  const handleCommit = async () => {
    // Implementation for committing changes
    toast({
      title: "Coming Soon",
      description: "Commit feature is under development",
    });
  };

  return (
    <Card className="p-4">
      <Tabs defaultValue="export" className="space-y-4">
        <TabsList>
          <TabsTrigger value="export">Export</TabsTrigger>
          <TabsTrigger value="import">Import</TabsTrigger>
        </TabsList>

        <div className="mb-4">
          {currentRepo && (
            <div className="space-y-4">
              <GitHubBranchSelect
                branches={branches}
                currentBranch={currentBranch}
                onBranchChange={setCurrentBranch}
              />
              <GitHubActions
                repoUrl={currentRepo}
                onCreatePR={handleCreatePR}
                onCreateBranch={handleCreateBranch}
                onCommit={handleCommit}
              />
            </div>
          )}
        </div>

        <TabsContent value="export">
          <GitHubExport onExportSuccess={setCurrentRepo} />
        </TabsContent>

        <TabsContent value="import">
          <GitHubImport />
        </TabsContent>
      </Tabs>
    </Card>
  );
}