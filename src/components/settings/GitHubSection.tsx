import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Github, Link, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface GitHubSectionProps {
  githubUrl: string;
  onChange: (url: string) => void;
}

export function GitHubSection({ githubUrl, onChange }: GitHubSectionProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const checkGitHubConnection = async () => {
    const { data: settings } = await supabase
      .from('settings')
      .select('github_token')
      .single();
    
    setIsConnected(!!settings?.github_token);
  };

  useEffect(() => {
    checkGitHubConnection();
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      // Redirect to GitHub OAuth
      const clientId = "YOUR_GITHUB_CLIENT_ID"; // This should be stored in Supabase Edge Function
      const redirectUri = `${window.location.origin}/settings/github/callback`;
      const scope = "repo,read:user,user:email";
      
      window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`;
    } catch (error) {
      console.error('GitHub connection error:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to GitHub. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      const { error } = await supabase
        .from('settings')
        .update({ github_token: null })
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      setIsConnected(false);
      toast({
        title: "GitHub Disconnected",
        description: "Your GitHub account has been disconnected successfully",
      });
    } catch (error) {
      console.error('GitHub disconnection error:', error);
      toast({
        title: "Error",
        description: "Failed to disconnect GitHub account",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Github className="w-5 h-5" />
          GitHub Integration
        </h3>
        {isConnected ? (
          <div className="flex items-center gap-2 text-green-500">
            <Check className="w-4 h-4" />
            Connected
          </div>
        ) : null}
      </div>

      {!isConnected ? (
        <Alert>
          <AlertDescription>
            Connect your GitHub account to enable repository imports, exports, and synchronization.
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="space-y-4">
        <div>
          <Label htmlFor="github-url">Repository URL</Label>
          <Input
            id="github-url"
            value={githubUrl}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://github.com/username/repo"
            disabled={!isConnected}
          />
        </div>

        <Button
          variant={isConnected ? "destructive" : "default"}
          onClick={isConnected ? handleDisconnect : handleConnect}
          disabled={isConnecting}
          className="w-full"
        >
          {isConnected ? (
            <>
              <X className="w-4 h-4 mr-2" />
              Disconnect GitHub
            </>
          ) : (
            <>
              <Link className="w-4 h-4 mr-2" />
              {isConnecting ? "Connecting..." : "Connect GitHub"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}