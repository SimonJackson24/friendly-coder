import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PlatformConnection } from "../types";
import { useSession } from "@supabase/auth-helpers-react";

export function usePlatformConnections() {
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const session = useSession();

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

  const handleConnect = async (platform: string) => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to connect your ad platform account.",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    try {
      const redirectUri = `${window.location.origin}/ads`;
      
      // For testing, we're using mock client IDs
      const oauthUrls: Record<string, string> = {
        facebook: `https://facebook.com/v18.0/dialog/oauth?client_id=mock_fb_client_id&redirect_uri=${redirectUri}&scope=ads_management`,
        google: `https://accounts.google.com/o/oauth2/v2/auth?client_id=mock_google_client_id&redirect_uri=${redirectUri}&scope=https://www.googleapis.com/auth/adwords`,
        linkedin: `https://www.linkedin.com/oauth/v2/authorization?client_id=mock_linkedin_client_id&redirect_uri=${redirectUri}&scope=ads_management`,
      };

      if (platform in oauthUrls) {
        // Handle OAuth code from URL if present
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        
        if (code) {
          const response = await supabase.functions.invoke('ad-platform-auth', {
            body: {
              platform,
              code,
              redirectUri,
              userId: session.user.id,
            },
          });

          if (response.error) throw new Error(response.error.message);
          
          // Clean up URL parameters
          window.history.replaceState({}, '', window.location.pathname);
          
          // Refresh connections data
          queryClient.invalidateQueries({ queryKey: ["platform-connections"] });
          
          toast({
            title: "Connection Successful",
            description: `Successfully connected to ${platform}.`,
          });
        } else {
          // Start OAuth flow
          window.location.href = oauthUrls[platform];
        }
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

  return {
    connections,
    isLoading,
    isConnecting,
    handleConnect,
  };
}