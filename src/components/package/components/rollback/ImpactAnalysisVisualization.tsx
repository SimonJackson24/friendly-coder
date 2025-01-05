import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, Server, PackageOpen } from "lucide-react";
import { ImpactAnalysisVisualization as ImpactAnalysis } from "../../types";

interface ImpactAnalysisVisualizationProps {
  analysis: ImpactAnalysis;
}

export function ImpactAnalysisVisualization({ analysis }: ImpactAnalysisVisualizationProps) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Impact Analysis</h3>
        <Badge variant={analysis.riskLevel === 'high' ? 'destructive' : 'default'}>
          {analysis.riskLevel.toUpperCase()} RISK
        </Badge>
      </div>

      <div className="grid gap-4">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4" />
          <span>Affected Services: {analysis.affectedServices.length}</span>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>Estimated Downtime: {analysis.estimatedDowntime} minutes</span>
        </div>

        {analysis.breakingChanges.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              <span>Breaking Changes ({analysis.breakingChanges.length})</span>
            </div>
            <ul className="ml-6 list-disc space-y-1">
              {analysis.breakingChanges.map((change, index) => (
                <li key={index} className="text-sm text-muted-foreground">{change}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <PackageOpen className="w-4 h-4" />
            <span>Dependency Impact</span>
          </div>
          <div className="space-y-3">
            {analysis.dependencyImpact.map((dep, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{dep.name}</span>
                  <span className={getRiskColor(dep.impact)}>{dep.impact}</span>
                </div>
                <Progress 
                  value={dep.impact === 'major' ? 100 : dep.impact === 'minor' ? 50 : 20}
                  className={`h-1 ${
                    dep.impact === 'major' ? 'bg-red-100' : 
                    dep.impact === 'minor' ? 'bg-yellow-100' : 
                    'bg-green-100'
                  }`}
                />
                <p className="text-xs text-muted-foreground">{dep.details}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}