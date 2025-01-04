import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Plus, MessageCircle, AlertCircle } from "lucide-react";
import { CreateIssueDialog } from "./CreateIssueDialog";
import { IssueCard } from "./IssueCard";
import { useToast } from "@/components/ui/use-toast";

interface IssueListProps {
  repositoryId: string;
}

export function IssueList({ repositoryId }: IssueListProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { toast } = useToast();

  const { data: issues, isLoading } = useQuery({
    queryKey: ["issues", repositoryId],
    queryFn: async () => {
      console.log("Fetching issues for repository:", repositoryId);
      const { data, error } = await supabase
        .from("issues")
        .select(`
          *,
          created_by_user:created_by(email),
          assigned_to_user:assigned_to(email),
          comments:issue_comments(count)
        `)
        .eq("repository_id", repositoryId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching issues:", error);
        toast({
          title: "Error",
          description: "Failed to load issues. Please try again.",
          variant: "destructive",
        });
        throw error;
      }

      return data;
    },
  });

  if (isLoading) {
    return <div>Loading issues...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Issues</h2>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          New Issue
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-4 p-1">
          {issues?.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
          {issues?.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No issues found. Create one to get started!</p>
            </div>
          )}
        </div>
      </ScrollArea>

      <CreateIssueDialog
        repositoryId={repositoryId}
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />
    </div>
  );
}