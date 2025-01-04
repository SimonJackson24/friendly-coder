import { ReleaseList } from "../releases/ReleaseList";

interface ReleaseSectionProps {
  repositoryId: string | null;
}

export function ReleaseSection({ repositoryId }: ReleaseSectionProps) {
  if (!repositoryId) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Select a repository to view its releases
        </p>
      </div>
    );
  }

  return <ReleaseList repositoryId={repositoryId} />;
}