import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function GitHubCallback() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      
      if (!code) {
        toast({
          title: "Error",
          description: "No authorization code received from GitHub",
          variant: "destructive",
        });
        navigate('/settings');
        return;
      }

      try {
        const response = await supabase.functions.invoke('github-oauth', {
          body: { code }
        });

        if (response.error) throw response.error;

        toast({
          title: "Success",
          description: "Successfully connected to GitHub",
        });
      } catch (error) {
        console.error('GitHub OAuth error:', error);
        toast({
          title: "Connection Failed",
          description: "Failed to connect to GitHub. Please try again.",
          variant: "destructive",
        });
      }

      navigate('/settings');
    };

    handleCallback();
  }, [navigate, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-lg font-semibold mb-2">Connecting to GitHub...</h2>
        <p className="text-gray-500">Please wait while we complete the connection.</p>
      </div>
    </div>
  );
}