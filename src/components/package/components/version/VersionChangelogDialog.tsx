import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { PackageVersion } from "../../types";
import { generateChangelog } from "../../utils/changelogGenerator";

interface VersionChangelogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentVersion: PackageVersion;
  previousVersion?: PackageVersion;
}

export function VersionChangelogDialog({
  open,
  onOpenChange,
  currentVersion,
  previousVersion
}: VersionChangelogDialogProps) {
  const [changelog, setChangelog] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!previousVersion) return;
    
    setIsGenerating(true);
    try {
      const generatedChangelog = await generateChangelog(currentVersion, previousVersion);
      setChangelog(generatedChangelog);
    } catch (error) {
      console.error('Error generating changelog:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Changelog</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Generate changelog from v{previousVersion?.version} to v{currentVersion.version}
          </div>

          {changelog ? (
            <pre className="p-4 bg-muted rounded-lg whitespace-pre-wrap">
              {changelog}
            </pre>
          ) : (
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !previousVersion}
              className="w-full"
            >
              Generate Changelog
            </Button>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}