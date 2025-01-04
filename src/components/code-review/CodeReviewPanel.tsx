import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { Check, X } from "lucide-react";

interface CodeReviewPanelProps {
  pullRequestId: string;
  onReviewSubmitted?: () => void;
}

export function CodeReviewPanel({ pullRequestId, onReviewSubmitted }: CodeReviewPanelProps) {
  const [comment, setComment] = useState("");
  const { toast } = useToast();
  const session = useSession();

  const handleSubmitReview = async (status: "approved" | "changes_requested") => {
    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to submit a review",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("code_reviews")
        .insert({
          pull_request_id: pullRequestId,
          reviewer_id: session.user.id,
          status,
          comment: comment.trim() || null,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Review submitted successfully",
      });

      setComment("");
      onReviewSubmitted?.();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">Review Changes</h3>
      
      <Textarea
        placeholder="Add your review comments..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="min-h-[100px]"
      />
      
      <div className="flex justify-end gap-2">
        <Button
          variant="destructive"
          onClick={() => handleSubmitReview("changes_requested")}
          className="flex items-center gap-2"
        >
          <X className="h-4 w-4" />
          Request Changes
        </Button>
        
        <Button
          variant="default"
          onClick={() => handleSubmitReview("approved")}
          className="flex items-center gap-2"
        >
          <Check className="h-4 w-4" />
          Approve
        </Button>
      </div>
    </Card>
  );
}