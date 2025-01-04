import { PackageVersion } from "../../types";
import { Button } from "@/components/ui/button";
import { GitCompare, ArrowRight } from "lucide-react";

interface CompareVersionsProps {
  selectedVersions: string[];
  versions: PackageVersion[];
  onShowDiff: () => void;
}

export function CompareVersions({ selectedVersions, versions, onShowDiff }: CompareVersionsProps) {
  if (selectedVersions.length !== 2) return null;

  return (
    <div className="mt-4 p-4 border rounded">
      <div className="flex justify-between items-center mb-2">
        <div>
          v{versions.find(v => v.id === selectedVersions[0])?.version}
          <ArrowRight className="inline mx-2" />
          v{versions.find(v => v.id === selectedVersions[1])?.version}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onShowDiff}
        >
          <GitCompare className="w-4 h-4 mr-2" />
          View Diff
        </Button>
      </div>
    </div>
  );
}