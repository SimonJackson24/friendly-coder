import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ExternalLink } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface PlatformConnection {
  id: string;
  platform: string;
  access_token: string | null;
  expires_at: string | null;
}

export function AdPlatformConnections() {
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query to fetch existing platform connections
  const { data: connections, isLoading } = useQuery({
    queryKey: ["platform-connections"],
    queryFn: async () => {
      console.log("Fetching platform connections...");
      const { data, error } = await supabase
        .from("ad_platform_connections")
        .select("*");

      if (error) {
        console.error("Error fetching platform connections:", error);
        throw error;
      }

      return data as PlatformConnection[];
    },
  });

  // Mutation to delete a platform connection
  const deleteMutation = useMutation({
    mutationFn: async (connectionId: string) => {
      const { error } = await supabase
        .from("ad_platform_connections")
        .delete()
        .eq("id", connectionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platform-connections"] });
      toast({
        title: "Connection removed",
        description: "The platform connection has been removed successfully.",
      });
    },
    onError: (error) => {
      console.error("Error deleting connection:", error);
      toast({
        title: "Error",
        description: "Failed to remove the platform connection.",
        variant: "destructive",
      });
    },
  });

  const handleConnect = async (platform: string) => {
    setIsConnecting(true);
    try {
      // For now, we'll just simulate OAuth flow with a placeholder
      // In a real implementation, this would redirect to the platform's OAuth page
      const redirectUrl = `${window.location.origin}/ads`;
      
      // Example OAuth URL structure (to be replaced with actual platform URLs)
      const oauthUrls: Record<string, string> = {
        facebook: `https://facebook.com/v18.0/dialog/oauth?client_id=YOUR_APP_ID&redirect_uri=${redirectUrl}&scope=ads_management`,
        google: `https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=${redirectUrl}&scope=https://www.googleapis.com/auth/adwords`,
        linkedin: `https://www.linkedin.com/oauth/v2/authorization?client_id=YOUR_CLIENT_ID&redirect_uri=${redirectUrl}&scope=ads_management`,
      };

      if (platform in oauthUrls) {
        window.location.href = oauthUrls[platform];
      } else {
        throw new Error("Unsupported platform");
      }
    } catch (error) {
      console.error("OAuth error:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to the ad platform. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Ad Platform Connections</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Facebook */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Facebook Ads</h3>
          {connections?.find(c => c.platform === "facebook") ? (
            <Alert className="mb-4">
              <AlertTitle>Connected</AlertTitle>
              <AlertDescription>
                Your Facebook Ads account is connected and ready to use.
              </AlertDescription>
            </Alert>
          ) : (
            <Button
              onClick={() => handleConnect("facebook")}
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
                  Connect Facebook Ads
                  <ExternalLink className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </Card>

        {/* Google Ads */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Google Ads</h3>
          {connections?.find(c => c.platform === "google") ? (
            <Alert className="mb-4">
              <AlertTitle>Connected</AlertTitle>
              <AlertDescription>
                Your Google Ads account is connected and ready to use.
              </AlertDescription>
            </Alert>
          ) : (
            <Button
              onClick={() => handleConnect("google")}
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
                  Connect Google Ads
                  <ExternalLink className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </Card>

        {/* LinkedIn */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">LinkedIn Ads</h3>
          {connections?.find(c => c.platform === "linkedin") ? (
            <Alert className="mb-4">
              <AlertTitle>Connected</AlertTitle>
              <AlertDescription>
                Your LinkedIn Ads account is connected and ready to use.
              </AlertDescription>
            </Alert>
          ) : (
            <Button
              onClick={() => handleConnect("linkedin")}
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
                  Connect LinkedIn Ads
                  <ExternalLink className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
}