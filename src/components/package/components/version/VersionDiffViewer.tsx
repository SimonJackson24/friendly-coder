import { ScrollArea } from "@/components/ui/scroll-area";
import { PackageVersion } from "../../types";
import { FileDiffViewer } from "@/components/version-control/FileDiffViewer";

interface VersionDiffViewerProps {
  oldVersion: PackageVersion;
  newVersion: PackageVersion;
}

export function VersionDiffViewer({ oldVersion, newVersion }: VersionDiffViewerProps) {
  const oldContent = JSON.stringify(oldVersion.package_data, null, 2);
  const newContent = JSON.stringify(newVersion.package_data, null, 2);

  return (
    <ScrollArea className="h-[400px] w-full">
      <FileDiffViewer 
        oldContent={oldContent}
        newContent={newContent}
        className="w-full"
      />
    </ScrollArea>
  );
}