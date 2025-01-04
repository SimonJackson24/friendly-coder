import { PackageVersion } from "../../types";
import { FileDiffViewer } from "@/components/version-control/FileDiffViewer";

interface VersionDiffProps {
  oldVersion: PackageVersion;
  newVersion: PackageVersion;
}

export function VersionDiff({ oldVersion, newVersion }: VersionDiffProps) {
  const oldContent = JSON.stringify(oldVersion.package_data, null, 2);
  const newContent = JSON.stringify(newVersion.package_data, null, 2);

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        Comparing version {oldVersion.version} with {newVersion.version}
      </div>
      
      <FileDiffViewer 
        oldContent={oldContent}
        newContent={newContent}
      />
    </div>
  );
}