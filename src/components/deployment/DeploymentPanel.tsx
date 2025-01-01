import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Rocket, Server, Globe, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DeploymentConfig {
  platform: string;
  domain?: string;
  environment?: 'production' | 'staging' | 'development';
}

export function DeploymentPanel() {
  const [platform, setPlatform] = useState<string>("");
  const [isDeploying, setIsDeploying] = useState(false);
  const [config, setConfig] = useState<DeploymentConfig>({
    platform: '',
    environment: 'production'
  });
  const { toast } = useToast();

  const handleDeploy = async () => {
    if (!platform) {
      toast({
        title: "Error",
        description: "Please select a deployment platform",
        variant: "destructive",
      });
      return;
    }

    setIsDeploying(true);
    try {
      const response = await supabase.functions.invoke('project-operations', {
        body: { 
          operation: 'deploy',
          data: { 
            platform,
            config
          }
        }
      });

      if (response.error) throw response.error;

      toast({
        title: "Deployment Started",
        description: `Deploying to ${platform}. You'll be notified when it's complete.`,
      });
    } catch (error) {
      console.error('Deployment error:', error);
      toast({
        title: "Deployment Failed",
        description: "Failed to start deployment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Deployment</h2>

      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5" />
            <h3 className="font-semibold">Platform</h3>
          </div>
          <Select value={platform} onValueChange={(value) => {
            setPlatform(value);
            setConfig(prev => ({ ...prev, platform: value }));
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vercel">Vercel</SelectItem>
              <SelectItem value="netlify">Netlify</SelectItem>
              <SelectItem value="cloudflare">Cloudflare Pages</SelectItem>
            </SelectContent>
          </Select>

          {platform && (
            <div className="space-y-4 mt-4">
              <div>
                <Label>Custom Domain (optional)</Label>
                <Input
                  placeholder="myapp.com"
                  value={config.domain || ''}
                  onChange={(e) => setConfig(prev => ({ ...prev, domain: e.target.value }))}
                />
              </div>
              <div>
                <Label>Environment</Label>
                <Select
                  value={config.environment}
                  onValueChange={(value: 'production' | 'staging' | 'development') => 
                    setConfig(prev => ({ ...prev, environment: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="production">Production</SelectItem>
                    <SelectItem value="staging">Staging</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </Card>

        <Card className="p-4 col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              <h3 className="font-semibold">Deployment Status</h3>
            </div>
            <Button onClick={handleDeploy} disabled={isDeploying || !platform}>
              {isDeploying ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deploying...
                </>
              ) : (
                <>
                  <Rocket className="w-4 h-4 mr-2" />
                  Deploy
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}