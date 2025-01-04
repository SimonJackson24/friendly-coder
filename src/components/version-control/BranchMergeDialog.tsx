import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileDiffViewer } from "./FileDiffViewer";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { mergeFiles } from "@/utils/mergeUtils";

interface BranchMergeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  sourceBranchId: string;
  targetBranchId: string;
  onMergeComplete: () => void;
}

export function BranchMergeDialog({
  isOpen,
  onOpenChange,
  sourceBranchId,
  targetBranchId,
  onMergeComplete,
}: BranchMergeDialogProps) {
  const [conflicts, setConflicts] = useState<any[]>([]);
  const [currentConflictIndex, setCurrentConflictIndex] = useState(0);
  const { toast } = useToast();

  const handleResolveConflict = async (resolvedContent: string) => {
    try {
      // Update the file content in the database
      const { error } = await supabase
        .from('files')
        .update({ content: resolvedContent })
        .eq('id', conflicts[currentConflictIndex].fileId);

      if (error) throw error;

      // Move to next conflict or complete merge
      if (currentConflictIndex < conflicts.length - 1) {
        setCurrentConflictIndex(currentConflictIndex + 1);
      } else {
        toast({
          title: "Merge completed",
          description: "All conflicts have been resolved",
        });
        onMergeComplete();
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error resolving conflict:", error);
      toast({
        title: "Error",
        description: "Failed to resolve conflict",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Resolve Merge Conflicts</DialogTitle>
        </DialogHeader>
        
        {conflicts.length > 0 && (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Resolving conflict {currentConflictIndex + 1} of {conflicts.length}
            </div>
            
            <FileDiffViewer
              oldContent={conflicts[currentConflictIndex]?.baseContent || ""}
              newContent={conflicts[currentConflictIndex]?.sourceContent || ""}
              hasConflicts={true}
              onResolveConflict={handleResolveConflict}
            />
          </div>
        )}
        
        {conflicts.length === 0 && (
          <div className="text-center py-4">
            No conflicts found. The branches can be merged automatically.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}