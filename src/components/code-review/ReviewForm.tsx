import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, X } from "lucide-react";

interface ReviewFormProps {
  comment: string;
  isLoading: boolean;
  onCommentChange: (value: string) => void;
  onSubmitReview: (status: "approved" | "changes_requested") => void;
}

export function ReviewForm({ 
  comment, 
  isLoading, 
  onCommentChange, 
  onSubmitReview 
}: ReviewFormProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Add Review</h3>
      
      <Textarea
        placeholder="Add your review comments..."
        value={comment}
        onChange={(e) => onCommentChange(e.target.value)}
        className="min-h-[100px] mb-4"
      />
      
      <div className="flex justify-end gap-2">
        <Button
          variant="destructive"
          onClick={() => onSubmitReview("changes_requested")}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <X className="h-4 w-4" />
          Request Changes
        </Button>
        
        <Button
          variant="default"
          onClick={() => onSubmitReview("approved")}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <Check className="h-4 w-4" />
          Approve
        </Button>
      </div>
    </div>
  );
}