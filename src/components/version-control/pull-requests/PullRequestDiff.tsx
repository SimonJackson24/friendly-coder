import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, ArrowRight, MessageSquare, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { DiffViewer } from "../diff/DiffViewer";

interface PullRequestDiffProps {
  pullRequestId: string;
  oldContent: string;
  newContent: string;
}

export function PullRequestDiff({ pullRequestId, oldContent, newContent }: PullRequestDiffProps) {
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const { toast } = useToast();
  const session = useSession();

  const handleAddComment = async () => {
    if (!session?.user?.id || !selectedLine || !comment.trim()) return;

    try {
      console.log("Adding review comment:", {
        pullRequestId,
        lineNumber: selectedLine,
        comment
      });

      const { error } = await supabase
        .from("review_comments")
        .insert({
          review_id: pullRequestId,
          line_number: selectedLine,
          content: comment.trim(),
        });

      if (error) throw error;

      toast({
        title: "Comment added",
        description: "Your review comment has been added successfully",
      });

      setComment("");
      setSelectedLine(null);
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    }
  };

  const handleLineClick = (lineNumber: number) => {
    setSelectedLine(lineNumber === selectedLine ? null : lineNumber);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-green-500">
            <CheckCircle className="h-4 w-4 mr-2" />
            Approve
          </Button>
          <Button variant="outline" size="sm" className="text-red-500">
            <XCircle className="h-4 w-4 mr-2" />
            Request Changes
          </Button>
        </div>
      </div>

      <DiffViewer
        oldContent={oldContent}
        newContent={newContent}
        onLineClick={handleLineClick}
      />

      {selectedLine && (
        <div className="flex gap-2 items-start">
          <MessageSquare className="h-5 w-5 mt-2 text-muted-foreground" />
          <div className="flex-1 space-y-2">
            <Textarea
              placeholder="Add a review comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button onClick={handleAddComment} disabled={!comment.trim()}>
              Add Comment
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}