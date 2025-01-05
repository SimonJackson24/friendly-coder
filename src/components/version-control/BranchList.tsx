/**
 * Copyright (c) 2024. All Rights Reserved.
 * 
 * This file is part of the proprietary software developed by the copyright holder.
 * 
 * This software uses the following open source packages under their respective licenses:
 * - @tanstack/react-query: MIT License (https://github.com/tanstack/query/blob/main/LICENSE)
 * - shadcn/ui components: MIT License (https://github.com/shadcn/ui/blob/main/LICENSE.md)
 * - Lucide Icons: MIT License (https://github.com/lucide-icons/lucide/blob/main/LICENSE)
 * 
 * While these dependencies are open source, this file and its contents remain proprietary
 * and may not be copied, modified, or distributed without explicit permission.
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, GitMerge } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CreateBranchDialog } from "./CreateBranchDialog";
import { BranchMergeDialog } from "./BranchMergeDialog";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface Branch {
  id: string;
  name: string;
  is_default: boolean;
  created_at: string;
  repository_id: string;
}

interface BranchListProps {
  repositoryId: string;
  onSelectBranch: (branchId: string) => void;
  activeBranchId: string | null;
}

export function BranchList({ repositoryId, onSelectBranch, activeBranchId }: BranchListProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isMergeDialogOpen, setIsMergeDialogOpen] = useState(false);
  const [targetBranchId, setTargetBranchId] = useState<string | null>(null);
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

  const handleMergeClick = (targetId: string) => {
    if (!activeBranchId) {
      toast({
        title: "Error",
        description: "Please select a source branch first",
        variant: "destructive",
      });
      return;
    }
    setTargetBranchId(targetId);
    setIsMergeDialogOpen(true);
  };

  const handleMergeComplete = () => {
    toast({
      title: "Success",
      description: "Branches merged successfully",
    });
  };

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
              className={cn(
                "p-4 border rounded-lg hover:bg-accent transition-colors",
                activeBranchId === branch.id && "bg-accent"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div>
                    <h3 className="font-semibold">{branch.name}</h3>
                    {branch.is_default && (
                      <span className="text-sm text-muted-foreground">Default branch</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSelectBranch(branch.id)}
                  >
                    Switch
                  </Button>
                  {activeBranchId && activeBranchId !== branch.id && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMergeClick(branch.id)}
                    >
                      <GitMerge className="w-4 h-4 mr-2" />
                      Merge into this
                    </Button>
                  )}
                </div>
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

      {targetBranchId && (
        <BranchMergeDialog
          isOpen={isMergeDialogOpen}
          onOpenChange={setIsMergeDialogOpen}
          sourceBranchId={activeBranchId!}
          targetBranchId={targetBranchId}
          onMergeComplete={handleMergeComplete}
        />
      )}
    </div>
  );
}
