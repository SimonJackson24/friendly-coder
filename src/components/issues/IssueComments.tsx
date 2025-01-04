import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { IssueComment } from "./types";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface IssueCommentsProps {
  issueId: string;
  comments: IssueComment[];
  onCommentAdded: () => void;
}

export function IssueComments({ issueId, comments, onCommentAdded }: IssueCommentsProps) {
  const [newComment, setNewComment] = useState("");
  const { toast } = useToast();

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
      onCommentAdded();
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold flex items-center gap-2">
        <MessageCircle className="w-5 h-5" />
        Comments
      </h3>
      <ScrollArea className="h-[300px]">
        <div className="space-y-4">
          {comments?.map((comment) => (
            <div key={comment.id} className="bg-muted p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Avatar>
                  <div className="w-full h-full flex items-center justify-center bg-primary">
                    {comment.created_by.email[0].toUpperCase()}
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
  );
}