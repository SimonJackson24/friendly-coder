import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, ExternalLink } from "lucide-react";
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
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">{displayName}</h3>
      {connection ? (
        <Alert className="mb-4">
          <AlertTitle>Connected</AlertTitle>
          <AlertDescription>
            Your {displayName} account is connected and ready to use.
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