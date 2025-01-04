import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileDiffViewer } from "./FileDiffViewer";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
  const [selectedCommit, setSelectedCommit] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<CommitChange | null>(null);

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
    queryKey: ["commit_changes", selectedCommit],
    queryFn: async () => {
      if (!selectedCommit) return null;
      const { data, error } = await supabase
        .from("commit_changes")
        .select("*")
        .eq("commit_id", selectedCommit);

      if (error) throw error;
      return data as CommitChange[];
    },
    enabled: !!selectedCommit,
  });

  const { data: previousContent } = useQuery({
    queryKey: ["previous_content", selectedFile?.commit_id, selectedFile?.file_path],
    queryFn: async () => {
      if (!selectedFile) return null;
      
      // Get the previous commit's content for this file
      const { data: commit } = await supabase
        .from("commits")
        .select("parent_commit_id")
        .eq("id", selectedFile.commit_id)
        .single();

      if (!commit?.parent_commit_id) return "";

      const { data } = await supabase
        .from("commit_changes")
        .select("content")
        .eq("commit_id", commit.parent_commit_id)
        .eq("file_path", selectedFile.file_path)
        .single();

      return data?.content || "";
    },
    enabled: !!selectedFile,
  });

  if (isLoading) {
    return <div>Loading commits...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Commit History</h2>
      <ScrollArea className="h-[400px]">
        <div className="space-y-2">
          {commits?.map((commit) => (
            <div
              key={commit.id}
              className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
              onClick={() => setSelectedCommit(commit.id)}
            >
              <h3 className="font-semibold">{commit.message}</h3>
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <span>Committed on {new Date(commit.created_at).toLocaleString()}</span>
              </div>
              {selectedCommit === commit.id && commitChanges && (
                <div className="mt-4 space-y-2">
                  <h4 className="font-medium">Changed Files:</h4>
                  {commitChanges.map((change) => (
                    <Button
                      key={change.id}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => setSelectedFile(change)}
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

      <Dialog open={!!selectedFile} onOpenChange={() => setSelectedFile(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedFile?.file_path}</DialogTitle>
          </DialogHeader>
          {selectedFile && (
            <FileDiffViewer
              oldContent={previousContent || ""}
              newContent={selectedFile.content || ""}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}