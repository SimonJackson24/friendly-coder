import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { User, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { IssueComments } from "./IssueComments";
import { IssueMetadata } from "./IssueMetadata";
import { Issue } from "./types";

interface IssueDetailViewProps {
  issueId: string;
  onClose: () => void;
}

export function IssueDetailView({ issueId, onClose }: IssueDetailViewProps) {
  const { data: issue, refetch: refetchIssue } = useQuery({
    queryKey: ["issue", issueId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("issues")
        .select(`
          *,
          created_by_user:created_by(email),
          assigned_to_user:assigned_to(email),
          comments:issue_comments(
            id,
            content,
            created_at,
            created_by(email)
          )
        `)
        .eq("id", issueId)
        .single();

      if (error) throw error;
      return data as Issue;
    },
  });

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data: { users }, error } = await supabase.auth.admin.listUsers();
      if (error) throw error;
      return users;
    },
  });

  if (!issue) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">{issue.title}</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
            <User className="w-4 h-4" />
            <span>Created by {issue.created_by_user?.email}</span>
            <Clock className="w-4 h-4 ml-2" />
            <span>
              {formatDistanceToNow(new Date(issue.created_at), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-grow space-y-6">
          <div className="bg-muted p-4 rounded-lg">
            <p className="whitespace-pre-wrap">{issue.description}</p>
          </div>

          <IssueComments 
            issueId={issueId}
            comments={issue.comments}
            onCommentAdded={refetchIssue}
          />
        </div>

        <IssueMetadata
          issueId={issueId}
          status={issue.status}
          labels={issue.labels}
          assignedTo={issue.assigned_to_user?.email}
          users={users || []}
          onUpdate={refetchIssue}
        />
      </div>
    </div>
  );
}