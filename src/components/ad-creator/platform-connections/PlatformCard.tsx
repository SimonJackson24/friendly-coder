import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, ExternalLink, CheckCircle2, XCircle } from "lucide-react";
import { PlatformConnection } from "../types";

interface PlatformCardProps {
  platform: string;
  displayName: string;
  connection: PlatformConnection | undefined;
  isConnecting: boolean;
  onConnect: (platform: string) => void;
}

export function PlatformCard({ 
  platform, 
  displayName, 
  connection, 
  isConnecting, 
  onConnect 
}: PlatformCardProps) {
  const isConnected = !!connection?.access_token;
  const expiresAt = connection?.expires_at ? new Date(connection.expires_at) : null;
  const isExpired = expiresAt ? expiresAt < new Date() : false;

  return (
    <Card className="p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{displayName}</h3>
          <div className="mt-1">
            {isConnected && !isExpired ? (
              <Badge className="bg-green-500">
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Connected
              </Badge>
            ) : isExpired ? (
              <Badge variant="destructive">
                <XCircle className="w-4 h-4 mr-1" />
                Expired
              </Badge>
            ) : (
              <Badge variant="secondary">
                <XCircle className="w-4 h-4 mr-1" />
                Not Connected
              </Badge>
            )}
          </div>
        </div>
      </div>

      {connection ? (
        <Alert>
          <AlertTitle>Connection Status</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>Connected since: {new Date(connection.created_at).toLocaleDateString()}</p>
            {expiresAt && (
              <p>Expires: {expiresAt.toLocaleDateString()}</p>
            )}
          </AlertDescription>
        </Alert>
      ) : (
        <Button
          onClick={() => onConnect(platform)}
          disabled={isConnecting}
          className="w-full"
        >
          {isConnecting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              Connect {displayName}
              <ExternalLink className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      )}
    </Card>
  );
}