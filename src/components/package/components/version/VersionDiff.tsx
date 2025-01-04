import { PackageVersion } from "../../types";
import { FileDiffViewer } from "@/components/version-control/FileDiffViewer";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface VersionDiffProps {
  oldVersion: PackageVersion;
  newVersion: PackageVersion;
}

export function VersionDiff({ oldVersion, newVersion }: VersionDiffProps) {
  const formatContent = (version: PackageVersion) => {
    return JSON.stringify(version.package_data, null, 2);
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Version Comparison</h3>
      <ScrollArea className="h-[400px]">
        <FileDiffViewer
          oldContent={formatContent(oldVersion)}
          newContent={formatContent(newVersion)}
          oldVersion={oldVersion.version}
          newVersion={newVersion.version}
        />
      </ScrollArea>
    </Card>
  );
}