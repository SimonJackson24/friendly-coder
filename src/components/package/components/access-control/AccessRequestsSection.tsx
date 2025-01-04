import { Button } from "@/components/ui/button";
import { AccessRequest } from "../../types";

interface AccessRequestsSectionProps {
  accessRequests: AccessRequest[];
  onHandleRequest: (requestId: string, approve: boolean) => void;
}

export function AccessRequestsSection({ 
  accessRequests, 
  onHandleRequest 
}: AccessRequestsSectionProps) {
  return (
    <div className="space-y-2">
      {accessRequests.map((request) => (
        <div
          key={request.id}
          className="flex justify-between items-center p-2 rounded hover:bg-accent"
        >
          <div>
            <div className="font-medium">{request.user_id}</div>
            <div className="text-sm text-muted-foreground">
              Requested: {request.requested_level}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => onHandleRequest(request.id, true)}
            >
              Approve
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onHandleRequest(request.id, false)}
            >
              Reject
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}