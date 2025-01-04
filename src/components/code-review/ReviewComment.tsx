import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

interface ReviewCommentProps {
  email: string;
  content: string;
  createdAt: string;
}

export function ReviewComment({ email, content, createdAt }: ReviewCommentProps) {
  return (
    <Card className="p-4 mb-4">
      <div className="flex items-start gap-3">
        <Avatar />
        <div className="flex-grow">
          <div className="flex items-center justify-between">
            <span className="font-medium">{email}</span>
            <span className="text-sm text-muted-foreground">
              {new Date(createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="mt-2 text-sm">{content}</p>
        </div>
      </div>
    </Card>
  );
}