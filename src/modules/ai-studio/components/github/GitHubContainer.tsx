import { VersionControl } from "@/components/version-control/VersionControl";
import { useProject } from "@/contexts/ProjectContext";

export function GitHubContainer() {
  const { selectedProject } = useProject();

  return (
    <div className="h-full">
      <VersionControl projectId={selectedProject?.id || null} />
    </div>
  );
}