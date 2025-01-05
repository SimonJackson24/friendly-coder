import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileDiffViewer } from "./FileDiffViewer";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

interface Commit {
  id: string;
  message: string;
  created_at: string;
  author_id: string;
  branch_id: string;
}

interface CommitChange {
  id: string;
  commit_id: string;
  file_path: string;
  content: string;
  change_type: string;
}

export function CommitHistory({ branchId }: { branchId: string }) {
  const [selectedCommits, setSelectedCommits] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<CommitChange | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  const { data: commits, isLoading } = useQuery({
    queryKey: ["commits", branchId],
    queryFn: async () => {
      console.log("Fetching commits for branch:", branchId);
      const { data, error } = await supabase
        .from("commits")
        .select("*")
        .eq("branch_id", branchId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching commits:", error);
        throw error;
      }

      return data as Commit[];
    },
    enabled: !!branchId,
  });

  const { data: commitChanges } = useQuery({
    queryKey: ["commit_changes", selectedCommits],
    queryFn: async () => {
      if (selectedCommits.length === 0) return null;
      const { data, error } = await supabase
        .from("commit_changes")
        .select("*")
        .in("commit_id", selectedCommits);

      if (error) throw error;
      return data as CommitChange[];
    },
    enabled: selectedCommits.length > 0,
  });

  const handleCommitSelect = (commitId: string) => {
    setSelectedCommits(prev => {
      if (prev.includes(commitId)) {
        return prev.filter(id => id !== commitId);
      }
      if (prev.length < 2) {
        return [...prev, commitId];
      }
      return [prev[1], commitId];
    });
  };

  const getFileContent = (fileChange: CommitChange | null, commitId: string) => {
    if (!commitChanges || !fileChange) return "";
    const change = commitChanges.find(
      c => c.commit_id === commitId && c.file_path === fileChange.file_path
    );
    return change?.content || "";
  };

  if (isLoading) {
    return <div>Loading commits...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Commit History</h2>
        {selectedCommits.length === 2 && (
          <Button onClick={() => setIsComparing(true)}>
            Compare Selected Commits
          </Button>
        )}
      </div>
      
      <ScrollArea className="h-[400px]">
        <div className="space-y-2">
          {commits?.map((commit) => (
            <div
              key={commit.id}
              className="p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedCommits.includes(commit.id)}
                  onCheckedChange={() => handleCommitSelect(commit.id)}
                />
                <div>
                  <h3 className="font-semibold">{commit.message}</h3>
                  <div className="text-sm text-muted-foreground">
                    Committed on {new Date(commit.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
              
              {selectedCommits.includes(commit.id) && commitChanges && (
                <div className="mt-4 space-y-2">
                  <h4 className="font-medium">Changed Files:</h4>
                  {commitChanges
                    .filter(change => change.commit_id === commit.id)
                    .map((change) => (
                      <Button
                        key={change.id}
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                          setSelectedFile(change);
                          setIsComparing(true);
                        }}
                      >
                        {change.file_path}
                      </Button>
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <Dialog open={isComparing} onOpenChange={setIsComparing}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {selectedFile ? selectedFile.file_path : "Select a file to compare"}
            </DialogTitle>
          </DialogHeader>
          {selectedFile && selectedCommits.length === 2 && (
            <FileDiffViewer
              oldContent={getFileContent(selectedFile, selectedCommits[0])}
              newContent={getFileContent(selectedFile, selectedCommits[1])}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}