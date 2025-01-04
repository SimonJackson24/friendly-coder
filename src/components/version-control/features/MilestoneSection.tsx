import { MilestoneList } from "../milestones/MilestoneList";

interface MilestoneSectionProps {
  repositoryId: string | null;
}

export function MilestoneSection({ repositoryId }: MilestoneSectionProps) {
  if (!repositoryId) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Select a repository to view its milestones
        </p>
      </div>
    );
  }

  return <MilestoneList repositoryId={repositoryId} />;
}