import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

interface AutoScalingSettingsProps {
  autoScalingEnabled: boolean;
  idleTimeout: number;
  onAutoScalingChange: (enabled: boolean) => void;
  onIdleTimeoutChange: (timeout: number) => void;
}

export function AutoScalingSettings({
  autoScalingEnabled,
  idleTimeout,
  onAutoScalingChange,
  onIdleTimeoutChange,
}: AutoScalingSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Auto-Scaling Settings</CardTitle>
        <CardDescription>
          Configure when to automatically scale down compute resources to save costs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            Auto-scaling will automatically scale down your Hugging Face endpoint when idle to reduce costs. 
            The endpoint will scale back up automatically when needed.
          </AlertDescription>
        </Alert>

        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="auto-scaling">Enable Auto-Scaling</Label>
          <Switch
            id="auto-scaling"
            checked={autoScalingEnabled}
            onCheckedChange={onAutoScalingChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="idle-timeout">Scale Down After (minutes)</Label>
          <Input
            id="idle-timeout"
            type="number"
            min={1}
            max={60}
            value={idleTimeout}
            onChange={(e) => onIdleTimeoutChange(Number(e.target.value))}
            disabled={!autoScalingEnabled}
          />
          <p className="text-sm text-muted-foreground">
            Your endpoint will scale to zero after this period of inactivity
          </p>
        </div>
      </CardContent>
    </Card>
  );
}