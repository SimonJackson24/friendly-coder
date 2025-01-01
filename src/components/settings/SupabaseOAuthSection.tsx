import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ExternalLink } from "lucide-react";

export function SupabaseOAuthSection() {
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();
  const session = useSession();

  const handleConnect = async () => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to connect your Supabase account.",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    try {
      // Redirect to Supabase OAuth
      const redirectUrl = `${window.location.origin}/settings`;
      window.location.href = `https://supabase.com/dashboard/account/tokens?redirect_to=${encodeURIComponent(redirectUrl)}`;
    } catch (error) {
      console.error("OAuth error:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to Supabase. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-md font-medium">Supabase OAuth Configuration</h3>
      
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Connect your Supabase account</AlertTitle>
        <AlertDescription className="space-y-2">
          <p>
            To manage your Supabase projects, you'll need to:
          </p>
          <ol className="list-decimal ml-4 space-y-1">
            <li>Connect your Supabase account</li>
            <li>Grant access to manage your projects</li>
          </ol>
        </AlertDescription>
      </Alert>

      <Button 
        onClick={handleConnect}
        disabled={isConnecting}
        className="flex items-center"
      >
        {isConnecting ? "Connecting..." : "Connect Supabase Account"}
        <ExternalLink className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}