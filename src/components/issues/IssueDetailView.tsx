import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, Tag, User, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

interface IssueDetailViewProps {
  issueId: string;
  onClose: () => void;
}

export function IssueDetailView({ issueId, onClose }: IssueDetailViewProps) {
  const [newComment, setNewComment] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const { toast } = useToast();

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
      return data;
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

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("issue_comments").insert({
        issue_id: issueId,
        content: newComment.trim(),
        created_by: user.id,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Comment added successfully",
      });

      setNewComment("");
      refetchIssue();
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    }
  };

  const handleAddLabel = async () => {
    if (!newLabel.trim() || !issue) return;

    try {
      const updatedLabels = [...(issue.labels || []), newLabel.trim()];
      const { error } = await supabase
        .from("issues")
        .update({ labels: updatedLabels })
        .eq("id", issueId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Label added successfully",
      });

      setNewLabel("");
      refetchIssue();
    } catch (error) {
      console.error("Error adding label:", error);
      toast({
        title: "Error",
        description: "Failed to add label",
        variant: "destructive",
      });
    }
  };

  const handleAssign = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("issues")
        .update({ assigned_to: userId })
        .eq("id", issueId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Issue assigned successfully",
      });

      refetchIssue();
    } catch (error) {
      console.error("Error assigning issue:", error);
      toast({
        title: "Error",
        description: "Failed to assign issue",
        variant: "destructive",
      });
    }
  };

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

          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Comments
            </h3>
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {issue.comments?.map((comment) => (
                  <div key={comment.id} className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar>
                        <div className="w-full h-full flex items-center justify-center bg-primary">
                          {comment.created_by.email?.[0].toUpperCase()}
                        </div>
                      </Avatar>
                      <div>
                        <div className="font-medium">{comment.created_by.email}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.created_at), {
                            addSuffix: true,
                          })}
                        </div>
                      </div>
                    </div>
                    <p className="whitespace-pre-wrap">{comment.content}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="space-y-2">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                rows={3}
              />
              <Button onClick={handleAddComment}>Add Comment</Button>
            </div>
          </div>
        </div>

        <div className="w-64 space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Status</h3>
            <Badge variant={issue.status === "open" ? "default" : "secondary"}>
              {issue.status}
            </Badge>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Assignee</h3>
            <Select
              value={issue.assigned_to || ""}
              onValueChange={handleAssign}
            >
              <SelectTrigger>
                <SelectValue placeholder="Assign to..." />
              </SelectTrigger>
              <SelectContent>
                {users?.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <h3 className="font-semibold flex items-center gap-2 mb-2">
              <Tag className="w-4 h-4" />
              Labels
            </h3>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1">
                {issue.labels?.map((label) => (
                  <Badge key={label} variant="outline">
                    {label}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="Add label..."
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
                <Button onClick={handleAddLabel} size="sm">
                  Add
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}