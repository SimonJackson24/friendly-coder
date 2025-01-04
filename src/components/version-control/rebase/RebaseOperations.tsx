import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GitMerge, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ConflictResolutionView } from "../merge/ConflictResolutionView";

interface RebaseOperation {
  id: string;
  source_branch_id: string;
  target_branch_id: string;
  status: string;
  conflicts: any;
  created_at: string;
}

interface RebaseOperationsProps {
  sourceBranchId: string;
  targetBranchId: string;
}

export function RebaseOperations({ sourceBranchId, targetBranchId }: RebaseOperationsProps) {
  const [selectedOperation, setSelectedOperation] = useState<RebaseOperation | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: operations, isLoading } = useQuery({
    queryKey: ["rebase-operations", sourceBranchId, targetBranchId],
    queryFn: async () => {
      console.log("Fetching rebase operations for branches:", { sourceBranchId, targetBranchId });
      const { data, error } = await supabase
        .from("rebase_operations")
        .select("*")
        .eq("source_branch_id", sourceBranchId)
        .eq("target_branch_id", targetBranchId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as RebaseOperation[];
    },
  });

  const startRebase = useMutation({
    mutationFn: async () => {
      console.log("Starting rebase operation");
      const { data, error } = await supabase
        .from("rebase_operations")
        .insert([
          {
            source_branch_id: sourceBranchId,
            target_branch_id: targetBranchId,
            status: "in_progress",
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["rebase-operations"] });
      setSelectedOperation(data);
      toast({
        title: "Success",
        description: "Rebase operation started successfully",
      });
    },
    onError: (error) => {
      console.error("Error starting rebase:", error);
      toast({
        title: "Error",
        description: "Failed to start rebase operation",
        variant: "destructive",
      });
    },
  });

  const completeRebase = useMutation({
    mutationFn: async (operationId: string) => {
      console.log("Completing rebase operation:", operationId);
      const { error } = await supabase
        .from("rebase_operations")
        .update({ status: "completed" })
        .eq("id", operationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rebase-operations"] });
      setSelectedOperation(null);
      toast({
        title: "Success",
        description: "Rebase completed successfully",
      });
    },
    onError: (error) => {
      console.error("Error completing rebase:", error);
      toast({
        title: "Error",
        description: "Failed to complete rebase",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return <div>Loading rebase operations...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GitMerge className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Rebase Operations</h2>
        </div>
        <Button
          onClick={() => startRebase.mutate()}
          disabled={startRebase.isPending || !!selectedOperation}
        >
          Start Rebase
        </Button>
      </div>

      {selectedOperation && selectedOperation.conflicts && (
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <h3 className="font-medium">Conflicts Detected</h3>
          </div>
          <ScrollArea className="h-[400px]">
            <ConflictResolutionView
              isLoading={false}
              conflicts={selectedOperation.conflicts}
              currentConflictIndex={0}
              onConflictResolved={() => {
                completeRebase.mutate(selectedOperation.id);
              }}
              onMerge={() => {
                completeRebase.mutate(selectedOperation.id);
              }}
            />
          </ScrollArea>
        </Card>
      )}

      <div className="space-y-2">
        {operations?.map((operation) => (
          <Card key={operation.id} className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">
                  Rebase Operation {operation.id.slice(0, 8)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Status: {operation.status} • Created:{" "}
                  {new Date(operation.created_at).toLocaleString()}
                </div>
              </div>
              {operation.status === "in_progress" && (
                <Button
                  onClick={() => setSelectedOperation(operation)}
                  disabled={!!selectedOperation}
                >
                  Continue
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}