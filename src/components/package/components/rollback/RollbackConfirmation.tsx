import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, ArrowDownToLine, Clock } from "lucide-react";
import { RollbackValidation, PackageVersion } from "../../types";
import { ImpactAnalysisVisualization } from "./ImpactAnalysisVisualization";
import { analyzeRollbackRisk } from "../../utils/changelogGenerator";

interface RollbackConfirmationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentVersion: PackageVersion;
  targetVersion: PackageVersion;
  onConfirm: () => void;
}

export function RollbackConfirmation({
  open,
  onOpenChange,
  currentVersion,
  targetVersion,
  onConfirm
}: RollbackConfirmationProps) {
  const [validation, setValidation] = useState<RollbackValidation | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeRollbackRisk(currentVersion, targetVersion);
      setValidation({
        valid: analysis.impact_analysis.risk_level !== 'high',
        breaking_changes: analysis.impact_analysis.breaking_changes,
        affected_services: analysis.impact_analysis.affected_dependencies,
        required_actions: [],
        estimated_downtime: 5,
        risk_level: analysis.impact_analysis.risk_level,
        validation_steps: [
          {
            id: '1',
            name: 'Dependency Check',
            status: analysis.impact_analysis.affected_dependencies.length > 5 ? 'failed' : 'passed'
          },
          {
            id: '2',
            name: 'Breaking Changes Check',
            status: analysis.impact_analysis.breaking_changes.length > 0 ? 'failed' : 'passed'
          }
        ],
        impactAnalysis: {
          affectedServices: analysis.impact_analysis.affected_dependencies,
          riskLevel: analysis.impact_analysis.risk_level,
          breakingChanges: analysis.impact_analysis.breaking_changes,
          estimatedDowntime: 5,
          dependencyImpact: analysis.impact_analysis.affected_dependencies.map(dep => ({
            name: dep,
            impact: 'minor' as const,
            details: `May require updates to maintain compatibility`
          }))
        }
      });
    } catch (error) {
      console.error('Error analyzing rollback:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Confirm Rollback</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Rolling back from</div>
              <div className="font-medium">v{currentVersion.version}</div>
            </div>
            <ArrowDownToLine className="w-5 h-5 text-muted-foreground" />
            <div>
              <div className="text-sm text-muted-foreground">to</div>
              <div className="font-medium">v{targetVersion.version}</div>
            </div>
          </div>

          {!validation && (
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full"
            >
              {isAnalyzing ? "Analyzing Impact..." : "Analyze Impact"}
            </Button>
          )}

          {validation && (
            <>
              <ImpactAnalysisVisualization analysis={validation.impactAnalysis} />

              <div className="space-y-2">
                {validation.validation_steps.map(step => (
                  <div
                    key={step.id}
                    className="flex items-center justify-between p-2 border rounded"
                  >
                    <span>{step.name}</span>
                    <span className={
                      step.status === 'passed' ? 'text-green-500' :
                      step.status === 'failed' ? 'text-red-500' :
                      'text-yellow-500'
                    }>
                      {step.status}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={!validation || !validation.valid}
          >
            Confirm Rollback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}