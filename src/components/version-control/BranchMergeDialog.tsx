import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileDiffViewer } from "./FileDiffViewer";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { Check, AlertTriangle, ArrowRight, GitMerge } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeReviewPanel } from "../code-review/CodeReviewPanel";

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
  const [activeTab, setActiveTab] = useState("changes");
  const { toast } = useToast();
  const session = useSession();

  useEffect(() => {
    if (isOpen) {
      fetchConflicts();
    }
  }, [isOpen, sourceBranchId, targetBranchId]);

  const detectConflicts = (sourceFiles: any[], targetFiles: any[]): Conflict[] => {
    const conflicts: Conflict[] = [];
    
    sourceFiles.forEach(sourceFile => {
      const targetFile = targetFiles.find(tf => tf.path === sourceFile.path);
      if (targetFile && targetFile.content !== sourceFile.content) {
        conflicts.push({
          fileId: sourceFile.id,
          fileName: sourceFile.name,
          baseContent: targetFile.content || "",
          sourceContent: sourceFile.content || "",
          targetContent: targetFile.content || "",
        });
      }
    });

    return conflicts;
  };

  const fetchConflicts = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching conflicts for merge:", { sourceBranchId, targetBranchId });
      
      const { data: sourceFiles, error: sourceError } = await supabase
        .from('files')
        .select('*')
        .eq('branch_id', sourceBranchId);

      const { data: targetFiles, error: targetError } = await supabase
        .from('files')
        .select('*')
        .eq('branch_id', targetBranchId);

      if (sourceError || targetError) throw sourceError || targetError;

      const detectedConflicts = detectConflicts(sourceFiles || [], targetFiles || []);
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
      
      // Create a new merge commit
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

      // Update the pull request status
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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitMerge className="h-5 w-5" />
            Merge Changes
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow">
          <TabsList>
            <TabsTrigger value="changes">Changes</TabsTrigger>
            <TabsTrigger value="conflicts">
              Conflicts
              {conflicts.length > 0 && (
                <span className="ml-2 bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded-full text-xs">
                  {conflicts.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="review">Review</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-grow mt-4">
            <TabsContent value="changes" className="m-0">
              <FileDiffViewer
                oldContent=""
                newContent=""
                className="h-[500px]"
              />
            </TabsContent>

            <TabsContent value="conflicts" className="m-0">
              {isLoading ? (
                <div className="flex items-center justify-center h-[500px]">
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
                    onResolveConflict={(resolvedContent) => {
                      // Handle conflict resolution
                      console.log("Resolved content:", resolvedContent);
                    }}
                  />
                </div>
              ) : (
                <div className="text-center py-4 space-y-2">
                  <Check className="h-8 w-8 text-green-500 mx-auto" />
                  <div className="text-lg font-medium">No conflicts found</div>
                  <div className="text-sm text-muted-foreground">
                    The branches can be merged automatically
                  </div>
                  <Button onClick={handleMerge}>
                    Complete Merge
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="review" className="m-0">
              <CodeReviewPanel pullRequestId="placeholder-id" />
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}