import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="auto-scaling">Enable Auto-Scaling</Label>
          <Switch
            id="auto-scaling"
            checked={autoScalingEnabled}
            onCheckedChange={onAutoScalingChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="idle-timeout">Idle Timeout (minutes)</Label>
          <Input
            id="idle-timeout"
            type="number"
            min={1}
            max={60}
            value={idleTimeout}
            onChange={(e) => onIdleTimeoutChange(Number(e.target.value))}
            disabled={!autoScalingEnabled}
          />
        </div>
      </CardContent>
    </Card>
  );
}