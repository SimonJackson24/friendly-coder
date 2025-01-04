import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PlatformConnection } from "../types";

export function usePlatformConnections() {
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
      const redirectUrl = `${window.location.origin}/ads`;
      
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

  return {
    connections,
    isLoading,
    isConnecting,
    handleConnect,
    deleteMutation,
  };
}