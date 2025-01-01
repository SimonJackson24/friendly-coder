import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Rocket, Server, Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function DeploymentPanel() {
  const [platform, setPlatform] = useState<string>("");
  const [isDeploying, setIsDeploying] = useState(false);
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
    // Deployment logic will be implemented here
    setIsDeploying(false);
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
          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger>
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vercel">Vercel</SelectItem>
              <SelectItem value="netlify">Netlify</SelectItem>
              <SelectItem value="cloudflare">Cloudflare Pages</SelectItem>
            </SelectContent>
          </Select>
        </Card>

        <Card className="p-4 col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              <h3 className="font-semibold">Deployment Status</h3>
            </div>
            <Button onClick={handleDeploy} disabled={isDeploying || !platform}>
              <Rocket className="w-4 h-4 mr-2" />
              {isDeploying ? "Deploying..." : "Deploy"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}