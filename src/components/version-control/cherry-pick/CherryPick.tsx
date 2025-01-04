import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { GitCommitHorizontal } from "lucide-react";

interface Commit {
  id: string;
  message: string;
  created_at: string;
}

interface CherryPickProps {
  commits: Commit[];
  onCherryPick: (commitIds: string[]) => Promise<void>;
}

export function CherryPick({ commits, onCherryPick }: CherryPickProps) {
  const [selectedCommits, setSelectedCommits] = useState<Set<string>>(new Set());
  const [isApplying, setIsApplying] = useState(false);
  const { toast } = useToast();

  const handleCherryPick = async () => {
    if (selectedCommits.size === 0) {
      toast({
        title: "Error",
        description: "Please select at least one commit to cherry-pick",
        variant: "destructive",
      });
      return;
    }

    setIsApplying(true);
    try {
      await onCherryPick(Array.from(selectedCommits));
      toast({
        title: "Success",
        description: "Selected commits have been cherry-picked successfully",
      });
      setSelectedCommits(new Set());
    } catch (error) {
      console.error("Error cherry-picking commits:", error);
      toast({
        title: "Error",
        description: "Failed to cherry-pick commits",
        variant: "destructive",
      });
    } finally {
      setIsApplying(false);
    }
  };

  const toggleCommit = (commitId: string) => {
    const newSelected = new Set(selectedCommits);
    if (newSelected.has(commitId)) {
      newSelected.delete(commitId);
    } else {
      newSelected.add(commitId);
    }
    setSelectedCommits(newSelected);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GitCommitHorizontal className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Cherry Pick Commits</h2>
        </div>
        <Button onClick={handleCherryPick} disabled={isApplying || selectedCommits.size === 0}>
          {isApplying ? "Applying..." : "Apply Selected"}
        </Button>
      </div>

      <Card className="p-4">
        <ScrollArea className="h-[400px]">
          <div className="space-y-2">
            {commits.map((commit) => (
              <div
                key={commit.id}
                className="flex items-start gap-3 p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <Checkbox
                  checked={selectedCommits.has(commit.id)}
                  onCheckedChange={() => toggleCommit(commit.id)}
                />
                <div className="flex-1">
                  <div className="font-medium">{commit.message}</div>
                  <div className="text-sm text-muted-foreground">
                    Commit {commit.id.slice(0, 8)} •{" "}
                    {new Date(commit.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}