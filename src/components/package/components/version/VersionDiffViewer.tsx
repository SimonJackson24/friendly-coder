import { PackageVersion } from "../../types";
import { DiffViewer } from "../diff/DiffViewer";

interface VersionDiffViewerProps {
  oldVersion: PackageVersion;
  newVersion: PackageVersion;
}

export function VersionDiffViewer({ oldVersion, newVersion }: VersionDiffViewerProps) {
  return (
    <DiffViewer
      oldContent={oldVersion.package_data}
      newContent={newVersion.package_data}
      oldVersion={oldVersion.version}
      newVersion={newVersion.version}
    />
  );
}