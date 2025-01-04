import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { Check, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";

interface CodeReviewPanelProps {
  pullRequestId: string;
  onReviewSubmitted?: () => void;
}

interface ReviewComment {
  id: string;
  content: string;
  created_at: string;
  reviewer: {
    email: string;
  };
}

export function CodeReviewPanel({ pullRequestId, onReviewSubmitted }: CodeReviewPanelProps) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<ReviewComment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const session = useSession();

  useEffect(() => {
    fetchComments();
  }, [pullRequestId]);

  const fetchComments = async () => {
    try {
      console.log("Fetching review comments for PR:", pullRequestId);
      
      const { data: reviewComments, error } = await supabase
        .from('review_comments')
        .select(`
          id,
          content,
          created_at,
          review:review_id (
            reviewer:reviewer_id (
              email
            )
          )
        `)
        .eq('pull_request_id', pullRequestId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Transform the data to match our ReviewComment interface
      const formattedComments: ReviewComment[] = reviewComments?.map(comment => ({
        id: comment.id,
        content: comment.content,
        created_at: comment.created_at,
        reviewer: {
          email: comment.review?.reviewer?.email || 'Unknown User'
        }
      })) || [];

      setComments(formattedComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast({
        title: "Error",
        description: "Failed to load review comments",
        variant: "destructive",
      });
    }
  };

  const handleSubmitReview = async (status: "approved" | "changes_requested") => {
    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to submit a review",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log("Submitting review:", { status, comment });
      
      // Create the review
      const { data: review, error: reviewError } = await supabase
        .from('code_reviews')
        .insert({
          pull_request_id: pullRequestId,
          reviewer_id: session.user.id,
          status,
          comment: comment.trim() || null,
        })
        .select()
        .single();

      if (reviewError) throw reviewError;

      // If there's a comment, create a review comment
      if (comment.trim()) {
        const { error: commentError } = await supabase
          .from('review_comments')
          .insert({
            review_id: review.id,
            content: comment.trim(),
            file_path: '/', // Default file path
            line_number: 0, // Default line number
            pull_request_id: pullRequestId
          });

        if (commentError) throw commentError;
      }

      toast({
        title: "Success",
        description: "Review submitted successfully",
      });

      setComment("");
      fetchComments();
      onReviewSubmitted?.();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <ScrollArea className="h-[300px] pr-4">
        {comments.map((comment) => (
          <Card key={comment.id} className="p-4 mb-4">
            <div className="flex items-start gap-3">
              <Avatar />
              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{comment.reviewer.email}</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-2 text-sm">{comment.content}</p>
              </div>
            </div>
          </Card>
        ))}
      </ScrollArea>
      
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Add Review</h3>
        
        <Textarea
          placeholder="Add your review comments..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="min-h-[100px] mb-4"
        />
        
        <div className="flex justify-end gap-2">
          <Button
            variant="destructive"
            onClick={() => handleSubmitReview("changes_requested")}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Request Changes
          </Button>
          
          <Button
            variant="default"
            onClick={() => handleSubmitReview("approved")}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <Check className="h-4 w-4" />
            Approve
          </Button>
        </div>
      </Card>
    </div>
  );
}