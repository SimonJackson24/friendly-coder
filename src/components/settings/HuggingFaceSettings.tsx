import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HuggingFaceModelSelect } from "./HuggingFaceModelSelect";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface HuggingFaceSettingsProps {
  currentModel?: string;
  computeType: string;
  instanceTier: string;
  onComputeTypeChange: (value: string) => void;
  onInstanceTierChange: (value: string) => void;
}

export function HuggingFaceSettings({
  currentModel,
  computeType,
  instanceTier,
  onComputeTypeChange,
  onInstanceTierChange,
}: HuggingFaceSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hugging Face Settings</CardTitle>
        <CardDescription>
          Configure your Hugging Face model and compute settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Model Selection</Label>
          <HuggingFaceModelSelect currentModel={currentModel} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="compute-type">Compute Type</Label>
          <Select value={computeType} onValueChange={onComputeTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select compute type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cpu">
                CPU
                <Badge variant="secondary" className="ml-2">Default</Badge>
              </SelectItem>
              <SelectItem value="gpu">
                GPU
                <Badge variant="secondary" className="ml-2">Faster</Badge>
              </SelectItem>
              <SelectItem value="gpu-t4">
                T4 GPU
                <Badge variant="secondary" className="ml-2">High Performance</Badge>
              </SelectItem>
              <SelectItem value="gpu-a100">
                A100 GPU
                <Badge variant="secondary" className="ml-2">Enterprise</Badge>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="instance-tier">Instance Tier</Label>
          <Select value={instanceTier} onValueChange={onInstanceTierChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select instance tier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">
                Small
                <Badge variant="secondary" className="ml-2">1-2 vCPU</Badge>
              </SelectItem>
              <SelectItem value="medium">
                Medium
                <Badge variant="secondary" className="ml-2">2-4 vCPU</Badge>
              </SelectItem>
              <SelectItem value="large">
                Large
                <Badge variant="secondary" className="ml-2">4-8 vCPU</Badge>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}