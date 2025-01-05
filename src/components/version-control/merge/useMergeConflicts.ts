import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MergeConflict } from "@/utils/mergeConflictUtils";
import { detectMergeConflicts } from "@/utils/mergeConflictUtils";

export function useMergeConflicts(sourceBranchId: string, targetBranchId: string) {
  const [conflicts, setConflicts] = useState<MergeConflict[]>([]);
  const [currentConflictIndex, setCurrentConflictIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

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

      const mergeConflicts: MergeConflict[] = [];
      
      sourceFiles?.forEach((sourceFile) => {
        const targetFile = targetFiles?.find(tf => tf.path === sourceFile.path);
        if (targetFile) {
          const baseContent = ""; // You might want to fetch the common ancestor content
          const markers = detectMergeConflicts(baseContent, sourceFile.content || "", targetFile.content || "");
          
          if (markers.length > 0) {
            mergeConflicts.push({
              filePath: sourceFile.path,
              conflicts: markers,
              baseContent: baseContent,
              currentContent: targetFile.content || "",
              incomingContent: sourceFile.content || ""
            });
          }
        }
      });

      setConflicts(mergeConflicts);
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

  const handleConflictResolved = () => {
    const newConflicts = [...conflicts];
    newConflicts.splice(currentConflictIndex, 1);
    setConflicts(newConflicts);
    
    setCurrentConflictIndex(Math.min(currentConflictIndex, newConflicts.length - 1));
    return newConflicts.length === 0;
  };

  return {
    conflicts,
    currentConflictIndex,
    isLoading,
    fetchConflicts,
    handleConflictResolved
  };
}