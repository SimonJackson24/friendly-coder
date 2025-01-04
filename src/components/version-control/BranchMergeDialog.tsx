import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileDiffViewer } from "./FileDiffViewer";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { mergeFiles } from "@/utils/mergeUtils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, AlertTriangle, ArrowRight } from "lucide-react";

interface BranchMergeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  sourceBranchId: string;
  targetBranchId: string;
  onMergeComplete: () => void;
}

interface Conflict {
  fileId: string;
  fileName: string;
  baseContent: string;
  sourceContent: string;
  targetContent: string;
}

export function BranchMergeDialog({
  isOpen,
  onOpenChange,
  sourceBranchId,
  targetBranchId,
  onMergeComplete,
}: BranchMergeDialogProps) {
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [currentConflictIndex, setCurrentConflictIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchConflicts();
    }
  }, [isOpen, sourceBranchId, targetBranchId]);

  const fetchConflicts = async () => {
    setIsLoading(true);
    try {
      // Fetch the files from both branches
      const { data: sourceFiles, error: sourceError } = await supabase
        .from('files')
        .select('*')
        .eq('branch_id', sourceBranchId);

      const { data: targetFiles, error: targetError } = await supabase
        .from('files')
        .select('*')
        .eq('branch_id', targetBranchId);

      if (sourceError || targetError) throw sourceError || targetError;

      // Compare files and detect conflicts
      const detectedConflicts = detectConflicts(sourceFiles, targetFiles);
      setConflicts(detectedConflicts);
    } catch (error) {
      console.error("Error fetching conflicts:", error);
      toast({
        title: "Error",
        description: "Failed to fetch merge conflicts",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const detectConflicts = (sourceFiles: any[], targetFiles: any[]) => {
    // Simple conflict detection - can be enhanced
    return sourceFiles
      .filter(sourceFile => {
        const targetFile = targetFiles.find(t => t.path === sourceFile.path);
        return targetFile && targetFile.content !== sourceFile.content;
      })
      .map(sourceFile => ({
        fileId: sourceFile.id,
        fileName: sourceFile.name,
        baseContent: sourceFile.content,
        sourceContent: sourceFile.content,
        targetContent: targetFiles.find(t => t.path === sourceFile.path)?.content || "",
      }));
  };

  const handleResolveConflict = async (resolvedContent: string) => {
    try {
      const currentConflict = conflicts[currentConflictIndex];
      
      // Update the file content in the database
      const { error } = await supabase
        .from('files')
        .update({ content: resolvedContent })
        .eq('id', currentConflict.fileId);

      if (error) throw error;

      // Move to next conflict or complete merge
      if (currentConflictIndex < conflicts.length - 1) {
        setCurrentConflictIndex(currentConflictIndex + 1);
        toast({
          title: "Conflict Resolved",
          description: `Resolved conflict in ${currentConflict.fileName}`,
        });
      } else {
        toast({
          title: "Merge Completed",
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
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {conflicts.length > 0 ? (
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
            ) : (
              <Check className="h-5 w-5 text-green-500" />
            )}
            Merge Conflicts
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-grow">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : conflicts.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Resolving conflict {currentConflictIndex + 1} of {conflicts.length}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">{conflicts[currentConflictIndex].fileName}</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
              
              <FileDiffViewer
                oldContent={conflicts[currentConflictIndex].baseContent}
                newContent={conflicts[currentConflictIndex].sourceContent}
                hasConflicts={true}
                onResolveConflict={handleResolveConflict}
              />
            </div>
          ) : (
            <div className="text-center py-4 space-y-2">
              <Check className="h-8 w-8 text-green-500 mx-auto" />
              <div className="text-lg font-medium">No conflicts found</div>
              <div className="text-sm text-muted-foreground">
                The branches can be merged automatically
              </div>
              <Button onClick={() => {
                onMergeComplete();
                onOpenChange(false);
              }}>
                Complete Merge
              </Button>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}