import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ExternalLink, Check } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";

export function SupabaseOAuthSection() {
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();
  const session = useSession();

  // Query to check if user has an existing Supabase connection
  const { data: connection, isLoading } = useQuery({
    queryKey: ['supabase-connection'],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data, error } = await supabase
        .from('supabase_connections')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching Supabase connection:', error);
        return null;
      }
      return data;
    },
    enabled: !!session?.user?.id,
  });

  // Handle OAuth token from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const expiresIn = params.get('expires_in');

    if (accessToken && refreshToken && expiresIn) {
      console.log('OAuth tokens received, saving connection...');
      saveConnection.mutate({
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_at: new Date(Date.now() + parseInt(expiresIn) * 1000).toISOString(),
      });
      
      // Clean up URL params
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Mutation to save Supabase connection
  const saveConnection = useMutation({
    mutationFn: async (tokenData: {
      access_token: string;
      refresh_token: string;
      expires_at: string;
    }) => {
      if (!session?.user?.id) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('supabase_connections')
        .upsert({
          user_id: session.user.id,
          ...tokenData,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Connection Successful",
        description: "Your Supabase account has been connected successfully.",
      });
    },
    onError: (error) => {
      console.error('Error saving connection:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to save Supabase connection. Please try again.",
        variant: "destructive",
      });
    },
  });

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-md font-medium">Supabase OAuth Configuration</h3>
      
      {connection ? (
        <Alert className="bg-green-50">
          <Check className="h-4 w-4 text-green-600" />
          <AlertTitle>Connected to Supabase</AlertTitle>
          <AlertDescription>
            Your Supabase account is connected and ready to use.
          </AlertDescription>
        </Alert>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}