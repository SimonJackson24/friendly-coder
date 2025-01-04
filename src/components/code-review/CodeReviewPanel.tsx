import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Check, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CodeReviewPanelProps {
  pullRequestId: string;
  filePath: string;
  content: string;
}

export function CodeReviewPanel({ pullRequestId, filePath, content }: CodeReviewPanelProps) {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmitReview = async (status: 'approved' | 'rejected') => {
    try {
      setIsSubmitting(true);
      console.log("Submitting review:", { pullRequestId, status, comment });

      const { data: review, error: reviewError } = await supabase
        .from('code_reviews')
        .insert({
          pull_request_id: pullRequestId,
          status,
          comment
        })
        .select()
        .single();

      if (reviewError) throw reviewError;

      if (comment.trim()) {
        const { error: commentError } = await supabase
          .from('review_comments')
          .insert({
            review_id: review.id,
            file_path: filePath,
            line_number: 1, // Default to first line for now
            content: comment
          });

        if (commentError) throw commentError;
      }

      toast({
        title: "Review submitted",
        description: `Your review has been ${status === 'approved' ? 'approved' : 'rejected'}.`,
      });

      setComment("");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Code Review</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSubmitReview('rejected')}
            disabled={isSubmitting}
          >
            <X className="h-4 w-4 mr-2 text-destructive" />
            Reject
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSubmitReview('approved')}
            disabled={isSubmitting}
          >
            <Check className="h-4 w-4 mr-2 text-green-500" />
            Approve
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[200px] border rounded-md">
        <div className="p-4">
          <pre className="text-sm">{content}</pre>
        </div>
      </ScrollArea>

      <div className="space-y-2">
        <label htmlFor="comment" className="text-sm font-medium">
          Review Comment
        </label>
        <Textarea
          id="comment"
          placeholder="Add your review comments here..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="min-h-[100px]"
        />
      </div>

      <div className="flex justify-end">
        <Button
          onClick={() => handleSubmitReview('approved')}
          disabled={isSubmitting}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Submit Review
        </Button>
      </div>
    </div>
  );
}