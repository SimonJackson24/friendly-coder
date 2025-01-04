import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

import { OptimizationTipProps } from "./types";

export function OptimizationTip({ category, tips, compliance, keywords }: OptimizationTipProps) {
  return (
    <div className="space-y-3">
      <h4 className="font-medium flex items-center gap-2">
        {category}
        <Badge variant="secondary">
          {tips.length} tips
        </Badge>
      </h4>
      
      {/* Best Practices */}
      <div className="space-y-2">
        <h5 className="text-sm font-medium text-muted-foreground">Best Practices:</h5>
        <ul className="space-y-2">
          {tips.map((tip, tipIndex) => (
            <li key={tipIndex} className="text-sm text-muted-foreground flex items-start gap-2">
              <span className="mt-1">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Compliance Guidelines */}
      {compliance && (
        <div className="space-y-2 mt-4">
          <h5 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            Compliance Requirements:
          </h5>
          <ul className="space-y-2">
            {compliance.map((rule, ruleIndex) => (
              <li key={ruleIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="mt-1">•</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommended Keywords */}
      {keywords && (
        <div className="space-y-2 mt-4">
          <h5 className="text-sm font-medium text-muted-foreground">Recommended Keywords:</h5>
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword, keywordIndex) => (
              <Badge key={keywordIndex} variant="outline">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}