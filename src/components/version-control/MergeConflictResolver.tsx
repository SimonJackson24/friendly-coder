import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { MergeConflict, resolveConflict, applyResolution } from "@/utils/mergeConflictUtils";
import { FileNode } from "@/hooks/useFileSystem";

interface MergeConflictResolverProps {
  file: FileNode;
  conflict: MergeConflict;
  onResolved: () => void;
}

export function MergeConflictResolver({
  file,
  conflict,
  onResolved
}: MergeConflictResolverProps) {
  const [selectedResolution, setSelectedResolution] = useState<'current' | 'incoming' | 'both'>('current');
  const { toast } = useToast();

  const handleResolve = async () => {
    try {
      console.log('Resolving conflict with selected strategy:', selectedResolution);
      
      const resolvedContent = resolveConflict(conflict, selectedResolution);
      await applyResolution(file, resolvedContent);
      
      toast({
        title: "Conflict Resolved",
        description: "The merge conflict has been successfully resolved.",
      });
      
      onResolved();
    } catch (error) {
      console.error('Error resolving conflict:', error);
      toast({
        title: "Error",
        description: "Failed to resolve the merge conflict.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Resolve Conflict</h3>
        <div className="space-x-2">
          <Button
            variant={selectedResolution === 'current' ? "default" : "outline"}
            onClick={() => setSelectedResolution('current')}
          >
            Keep Current
          </Button>
          <Button
            variant={selectedResolution === 'incoming' ? "default" : "outline"}
            onClick={() => setSelectedResolution('incoming')}
          >
            Accept Incoming
          </Button>
          <Button
            variant={selectedResolution === 'both' ? "default" : "outline"}
            onClick={() => setSelectedResolution('both')}
          >
            Keep Both
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[400px] border rounded-md">
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Current Changes</h4>
            <pre className="bg-muted p-2 rounded">
              {conflict.currentContent}
            </pre>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Incoming Changes</h4>
            <pre className="bg-muted p-2 rounded">
              {conflict.incomingContent}
            </pre>
          </div>
        </div>
      </ScrollArea>

      <div className="flex justify-end">
        <Button onClick={handleResolve}>
          Apply Resolution
        </Button>
      </div>
    </div>
  );
}