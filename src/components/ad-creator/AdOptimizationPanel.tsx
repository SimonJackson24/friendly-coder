import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Info } from "lucide-react";
import { PlatformTips } from "./optimization/PlatformTips";
import { platformRecommendations } from "./optimization/platformRecommendations";

interface AdOptimizationPanelProps {
  platform: string;
}

export function AdOptimizationPanel({ platform }: AdOptimizationPanelProps) {
  const recommendations = platformRecommendations.find(
    (p) => p.platform === platform
  );

  if (!recommendations) return null;

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Info className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-semibold capitalize">
          {platform} Optimization Tips
        </h3>
      </div>
      <ScrollArea className="h-[400px]">
        <PlatformTips recommendations={recommendations.recommendations} />
      </ScrollArea>
    </Card>
  );
}