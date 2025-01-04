import { PackageVersion } from "../../types";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface VersionListProps {
  versions: PackageVersion[];
  selectedVersions: string[];
  onVersionSelect: (versionId: string) => void;
  onViewNotes: (version: PackageVersion) => void;
  onRollback: (versionId: string) => void;
}

export function VersionList({
  versions,
  selectedVersions,
  onVersionSelect,
  onViewNotes,
  onRollback
}: VersionListProps) {
  return (
    <div className="space-y-2">
      {versions.map((version) => (
        <div
          key={version.id}
          className={`p-2 rounded hover:bg-accent flex justify-between items-center ${
            selectedVersions.includes(version.id) ? "bg-accent" : ""
          }`}
          onClick={() => onVersionSelect(version.id)}
        >
          <div>
            <div className="font-medium">v{version.version}</div>
            <div className="text-sm text-muted-foreground">
              {new Date(version.created_at).toLocaleDateString()}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onViewNotes(version);
              }}
            >
              Notes
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onRollback(version.id);
              }}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}