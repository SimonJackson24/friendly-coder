import { PackageVersion } from "../../types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Package, GitBranch, AlertTriangle } from "lucide-react";

interface VersionMetadataProps {
  version: PackageVersion;
}

export function VersionMetadata({ version }: VersionMetadataProps) {
  const getDependencyCount = () => {
    return Object.keys(version.dependency_tree || {}).length;
  };

  const getConflictCount = () => {
    return Object.keys(version.conflict_status || {}).filter(
      key => version.conflict_status[key].hasConflict
    ).length;
  };

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Version {version.version}</h3>
        <Badge variant={getConflictCount() > 0 ? "destructive" : "default"}>
          {version.version}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{new Date(version.created_at).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Package className="h-4 w-4" />
          <span>{getDependencyCount()} Dependencies</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <GitBranch className="h-4 w-4" />
          <span>Published by {version.published_by}</span>
        </div>
        {getConflictCount() > 0 && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertTriangle className="h-4 w-4" />
            <span>{getConflictCount()} Conflicts</span>
          </div>
        )}
      </div>
    </Card>
  );
}