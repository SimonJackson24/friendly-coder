import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { InfoIcon } from "lucide-react";

interface DeploymentSectionProps {
  project: any;
}

export function DeploymentSection({ project }: DeploymentSectionProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Deployment Settings</h3>
      
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          Configure how your project is deployed and where it's hosted.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <Card className="p-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Deployment Platform</Label>
              <Select defaultValue="vercel">
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vercel">Vercel</SelectItem>
                  <SelectItem value="netlify">Netlify</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Custom Domain</Label>
              <Input 
                placeholder="your-domain.com" 
                defaultValue={project?.custom_domain || ""}
              />
              <p className="text-sm text-muted-foreground">
                Enter your custom domain if you want to use one
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}