import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useMergeActions(
  targetBranchId: string,
  sourceBranchId: string,
  onMergeComplete: () => void,
  onOpenChange: (open: boolean) => void
) {
  const session = useSession();
  const { toast } = useToast();

  const handleMerge = async () => {
    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to perform merges",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Initiating merge process");
      
      const { data: mergeCommit, error: commitError } = await supabase
        .from('commits')
        .insert({
          branch_id: targetBranchId,
          message: `Merge branch ${sourceBranchId} into ${targetBranchId}`,
          parent_commit_id: null,
          author_id: session.user.id
        })
        .select()
        .single();

      if (commitError) throw commitError;

      const { error: prError } = await supabase
        .from('pull_requests')
        .update({ status: 'merged' })
        .eq('source_branch_id', sourceBranchId)
        .eq('target_branch_id', targetBranchId);

      if (prError) throw prError;

      toast({
        title: "Success",
        description: "Branches merged successfully",
      });
      
      onMergeComplete();
      onOpenChange(false);
    } catch (error) {
      console.error("Error during merge:", error);
      toast({
        title: "Error",
        description: "Failed to complete merge",
        variant: "destructive",
      });
    }
  };

  return { handleMerge };
}