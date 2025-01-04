import { OptimizationTip } from "./OptimizationTip";
import { PlatformTipsProps } from "./types";

export function PlatformTips({ recommendations }: PlatformTipsProps) {
  return (
    <div className="space-y-6">
      {recommendations.map((rec, index) => (
        <OptimizationTip key={index} {...rec} />
      ))}
    </div>
  );
}