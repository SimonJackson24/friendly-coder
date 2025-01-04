import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Info } from "lucide-react";
import { PlatformTips } from "./optimization/PlatformTips";
import { platformRecommendations } from "./optimization/platformRecommendations";

interface AdOptimizationPanelProps {
  platform: string;
}

export function AdOptimizationPanel({ platform }: AdOptimizationPanelProps) {
  // Add console log to debug platform selection
  console.log("AdOptimizationPanel - Current platform:", platform);
  console.log("Available recommendations:", platformRecommendations.map(p => p.platform));

  const recommendations = platformRecommendations.find(
    (p) => p.platform === platform
  );

  console.log("Found recommendations:", recommendations?.platform);

  if (!recommendations) {
    console.log("No recommendations found for platform:", platform);
    return null;
  }

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