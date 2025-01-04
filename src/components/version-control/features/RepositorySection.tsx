import { Card } from "@/components/ui/card";
import { RepositoryList } from "../RepositoryList";

interface RepositorySectionProps {
  projectId: string;
  onSelectRepository: (id: string | null) => void;
}

export function RepositorySection({ projectId, onSelectRepository }: RepositorySectionProps) {
  return (
    <Card className="space-y-4">
      <RepositoryList 
        projectId={projectId} 
        onSelectRepository={onSelectRepository}
      />
    </Card>
  );
}