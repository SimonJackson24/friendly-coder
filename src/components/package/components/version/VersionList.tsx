import { PackageVersion } from "../../types";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, RotateCcw } from "lucide-react";

interface VersionListProps {
  versions: PackageVersion[];
  selectedVersions: string[];
  onVersionSelect: (versionId: string) => void;
  onViewNotes: (version: PackageVersion) => void;
  onRollback?: (version: PackageVersion) => void;
  compareMode?: boolean;
}

export function VersionList({
  versions,
  selectedVersions,
  onVersionSelect,
  onViewNotes,
  onRollback,
  compareMode = false
}: VersionListProps) {
  return (
    <ScrollArea className="h-[200px]">
      <div className="space-y-2">
        {versions.map((version) => (
          <div
            key={version.id}
            className={`p-2 rounded hover:bg-accent flex justify-between items-center cursor-pointer ${
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
                <History className="h-4 w-4" />
              </Button>
              {onRollback && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRollback(version);
                  }}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}