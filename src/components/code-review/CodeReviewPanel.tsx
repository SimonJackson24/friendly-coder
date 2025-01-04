import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ReviewComment } from "./ReviewComment";
import { ReviewForm } from "./ReviewForm";

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
        .from('code_reviews')
        .select(`
          id,
          comment,
          created_at,
          reviewer:reviewer_id (
            email
          )
        `)
        .eq('pull_request_id', pullRequestId);

      if (error) {
        console.error("Error fetching comments:", error);
        throw error;
      }

      console.log("Fetched review comments:", reviewComments);

      if (reviewComments) {
        const formattedComments: ReviewComment[] = reviewComments
          .filter(comment => comment.comment) // Only include comments that have content
          .map(review => ({
            id: review.id,
            content: review.comment || '',
            created_at: review.created_at,
            reviewer: {
              email: review.reviewer?.email || 'Unknown User'
            }
          }));

        setComments(formattedComments);
      }
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
          <ReviewComment
            key={comment.id}
            email={comment.reviewer.email}
            content={comment.content}
            createdAt={comment.created_at}
          />
        ))}
      </ScrollArea>
      
      <Card className="p-4">
        <ReviewForm
          comment={comment}
          isLoading={isLoading}
          onCommentChange={setComment}
          onSubmitReview={handleSubmitReview}
        />
      </Card>
    </div>
  );
}