import { useEffect, useState } from "react";
import { PackageVersion } from "../../types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { diffJson } from 'diff';

interface VersionDiffViewerProps {
  oldVersion: PackageVersion;
  newVersion: PackageVersion;
}

export function VersionDiffViewer({ oldVersion, newVersion }: VersionDiffViewerProps) {
  const [diff, setDiff] = useState<any[]>([]);

  useEffect(() => {
    const differences = diffJson(
      oldVersion.package_data,
      newVersion.package_data
    );
    setDiff(differences);
  }, [oldVersion, newVersion]);

  return (
    <ScrollArea className="h-[500px] w-full rounded-md border p-4">
      <div className="space-y-4">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Version {oldVersion.version}</span>
          <span>→</span>
          <span>Version {newVersion.version}</span>
        </div>

        <div className="font-mono text-sm">
          {diff.map((part, index) => (
            <span
              key={index}
              className={
                part.added
                  ? "bg-green-100 text-green-800"
                  : part.removed
                  ? "bg-red-100 text-red-800"
                  : "text-gray-800"
              }
            >
              {part.value}
            </span>
          ))}
        </div>

        {newVersion.changes && (
          <div className="mt-4">
            <h3 className="font-medium">Changes</h3>
            <p className="text-sm text-muted-foreground">{newVersion.changes}</p>
          </div>
        )}

        {newVersion.conflict_status && Object.keys(newVersion.conflict_status).length > 0 && (
          <div className="mt-4">
            <h3 className="font-medium text-destructive">Conflicts</h3>
            <pre className="text-sm bg-destructive/10 p-2 rounded">
              {JSON.stringify(newVersion.conflict_status, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}