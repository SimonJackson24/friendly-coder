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
      console.log("Fetching issue details for:", issueId);
      
      // First get the issue details
      const { data: issueData, error: issueError } = await supabase
        .from("issues")
        .select(`
          id,
          title,
          description,
          status,
          labels,
          created_at,
          created_by,
          assigned_to,
          comments:issue_comments(
            id,
            content,
            created_at,
            created_by
          )
        `)
        .eq("id", issueId)
        .maybeSingle();

      if (issueError) {
        console.error("Error fetching issue:", issueError);
        throw issueError;
      }

      if (!issueData) {
        throw new Error("Issue not found");
      }

      // Then get the user details for created_by and assigned_to
      const { data: createdByUser } = await supabase.auth.admin.getUserById(issueData.created_by);
      const assignedToUser = issueData.assigned_to ? 
        (await supabase.auth.admin.getUserById(issueData.assigned_to)).data : null;

      // Get comment authors
      const commentUserIds = issueData.comments.map(comment => comment.created_by);
      const { data: commentUsers } = await supabase.auth.admin.listUsers();
      const userMap = new Map(commentUsers.users.map(user => [user.id, user]));

      // Transform the data to match our Issue type
      const transformedIssue: Issue = {
        ...issueData,
        created_by_user: { email: createdByUser?.user?.email || 'Unknown' },
        assigned_to_user: assignedToUser?.user ? { email: assignedToUser.user.email } : null,
        comments: issueData.comments.map(comment => ({
          ...comment,
          created_by: { email: userMap.get(comment.created_by)?.email || 'Unknown' }
        }))
      };

      console.log("Transformed issue data:", transformedIssue);
      return transformedIssue;
    },
  });

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      console.log("Fetching users list");
      const { data: { users }, error } = await supabase.auth.admin.listUsers();
      
      if (error) {
        console.error("Error fetching users:", error);
        throw error;
      }

      // Transform users to match our expected format
      const formattedUsers = users.map(user => ({
        id: user.id,
        email: user.email || ''
      }));

      console.log("Formatted users:", formattedUsers);
      return formattedUsers;
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