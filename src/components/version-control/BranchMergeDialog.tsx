import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileDiffViewer } from "./FileDiffViewer";
import { GitMerge } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeReviewPanel } from "../code-review/CodeReviewPanel";
import { ConflictResolutionView } from "./merge/ConflictResolutionView";
import { useMergeConflicts } from "./merge/useMergeConflicts";
import { useMergeActions } from "./merge/useMergeActions";
import type { MergeDialogProps } from "./merge/types";

export function BranchMergeDialog({
  isOpen,
  onOpenChange,
  sourceBranchId,
  targetBranchId,
  onMergeComplete,
}: MergeDialogProps) {
  const [activeTab, setActiveTab] = useState("changes");
  
  const {
    conflicts,
    currentConflictIndex,
    isLoading,
    fetchConflicts,
    handleConflictResolved
  } = useMergeConflicts(sourceBranchId, targetBranchId);

  const { handleMerge } = useMergeActions(
    targetBranchId,
    sourceBranchId,
    onMergeComplete,
    onOpenChange
  );

  useEffect(() => {
    if (isOpen) {
      fetchConflicts();
    }
  }, [isOpen, sourceBranchId, targetBranchId]);

  const onConflictResolved = () => {
    const allResolved = handleConflictResolved();
    if (allResolved) {
      handleMerge();
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
              <ConflictResolutionView
                isLoading={isLoading}
                conflicts={conflicts}
                currentConflictIndex={currentConflictIndex}
                onConflictResolved={onConflictResolved}
                onMerge={handleMerge}
              />
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