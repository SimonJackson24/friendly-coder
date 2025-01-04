import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Calendar, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface IssueCardProps {
  issue: any; // We'll type this properly later
}

export function IssueCard({ issue }: IssueCardProps) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="font-medium">{issue.title}</h3>
          <Badge variant={issue.status === "open" ? "default" : "secondary"}>
            {issue.status}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {issue.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            <span>{issue.comments?.[0]?.count || 0}</span>
          </div>

          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>
              {formatDistanceToNow(new Date(issue.created_at), {
                addSuffix: true,
              })}
            </span>
          </div>

          {issue.assigned_to && (
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{issue.assigned_to_user?.email}</span>
            </div>
          )}

          <div className="flex gap-1">
            {issue.labels?.map((label: string) => (
              <Badge key={label} variant="outline">
                {label}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}