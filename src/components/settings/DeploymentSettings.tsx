import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface DeploymentSettingsProps {
  platform: string;
  platformSettings: any;
  onPlatformChange: (value: string) => void;
  onPlatformSettingsChange: (settings: any) => void;
}

export function DeploymentSettings({
  platform,
  platformSettings,
  onPlatformChange,
  onPlatformSettingsChange,
}: DeploymentSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Deployment Settings</CardTitle>
        <CardDescription>
          Configure your preferred deployment platform and settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="platform">Default Platform</Label>
          <Select value={platform} onValueChange={onPlatformChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vercel">Vercel</SelectItem>
              <SelectItem value="netlify">Netlify</SelectItem>
              <SelectItem value="cloudflare">Cloudflare Pages</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {platform === 'vercel' && (
          <div className="space-y-2">
            <Label htmlFor="vercel-token">Vercel Token</Label>
            <Input
              id="vercel-token"
              type="password"
              value={platformSettings?.vercel?.token || ''}
              onChange={(e) => onPlatformSettingsChange({
                ...platformSettings,
                vercel: { ...platformSettings?.vercel, token: e.target.value }
              })}
              placeholder="Enter your Vercel token"
            />
          </div>
        )}

        {platform === 'netlify' && (
          <div className="space-y-2">
            <Label htmlFor="netlify-token">Netlify Token</Label>
            <Input
              id="netlify-token"
              type="password"
              value={platformSettings?.netlify?.token || ''}
              onChange={(e) => onPlatformSettingsChange({
                ...platformSettings,
                netlify: { ...platformSettings?.netlify, token: e.target.value }
              })}
              placeholder="Enter your Netlify token"
            />
          </div>
        )}

        {platform === 'cloudflare' && (
          <div className="space-y-2">
            <Label htmlFor="cloudflare-token">Cloudflare Token</Label>
            <Input
              id="cloudflare-token"
              type="password"
              value={platformSettings?.cloudflare?.token || ''}
              onChange={(e) => onPlatformSettingsChange({
                ...platformSettings,
                cloudflare: { ...platformSettings?.cloudflare, token: e.target.value }
              })}
              placeholder="Enter your Cloudflare token"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}