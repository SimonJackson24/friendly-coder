import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PackageVersion } from "../../types";
import { generateAutomatedChangelog, analyzeRollbackRisk } from "../../utils/changelogGenerator";

interface VersionChangelogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentVersion: PackageVersion;
  previousVersion?: PackageVersion;
  onSave: (changelog: string) => void;
}

export function VersionChangelogDialog({
  open,
  onOpenChange,
  currentVersion,
  previousVersion,
  onSave
}: VersionChangelogDialogProps) {
  const [changelog, setChangelog] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [rollbackAnalysis, setRollbackAnalysis] = useState<{ riskLevel: string; analysis: string[] } | null>(null);

  useEffect(() => {
    if (open && currentVersion) {
      handleGenerateChangelog();
      if (previousVersion) {
        analyzeRollback();
      }
    }
  }, [open, currentVersion, previousVersion]);

  const handleGenerateChangelog = async () => {
    setIsGenerating(true);
    try {
      const generated = await generateAutomatedChangelog(currentVersion, previousVersion);
      setChangelog(generated);
    } catch (error) {
      console.error("Error generating changelog:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const analyzeRollback = async () => {
    if (!previousVersion) return;
    
    try {
      const analysis = await analyzeRollbackRisk(currentVersion, previousVersion);
      setRollbackAnalysis(analysis);
    } catch (error) {
      console.error("Error analyzing rollback risk:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Version {currentVersion?.version} Changelog</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Button 
              onClick={handleGenerateChangelog}
              disabled={isGenerating}
            >
              Regenerate Changelog
            </Button>
          </div>

          {rollbackAnalysis && (
            <div className={`p-4 rounded-md ${
              rollbackAnalysis.riskLevel === 'high' ? 'bg-red-100' :
              rollbackAnalysis.riskLevel === 'medium' ? 'bg-yellow-100' :
              'bg-green-100'
            }`}>
              <h4 className="font-semibold mb-2">Rollback Risk Analysis: {rollbackAnalysis.riskLevel}</h4>
              <ul className="list-disc pl-4">
                {rollbackAnalysis.analysis.map((risk, index) => (
                  <li key={index}>{risk}</li>
                ))}
              </ul>
            </div>
          )}

          <Textarea
            value={changelog}
            onChange={(e) => setChangelog(e.target.value)}
            className="min-h-[300px] font-mono"
          />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={() => onSave(changelog)}>
              Save Changelog
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}