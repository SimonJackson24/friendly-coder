import { WikiContainer } from "@/components/wiki/WikiContainer";
import { Card } from "@/components/ui/card";

interface WikiSectionProps {
  repositoryId: string;
}

export function WikiSection({ repositoryId }: WikiSectionProps) {
  return (
    <Card className="p-4">
      <h2 className="text-2xl font-bold mb-4">Wiki</h2>
      <WikiContainer repositoryId={repositoryId} />
    </Card>
  );
}