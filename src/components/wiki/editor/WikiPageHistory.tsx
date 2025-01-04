import { Button } from "@/components/ui/button";

interface WikiPageHistoryProps {
  history: Array<{
    id: string;
    content: string;
    created_at: string;
  }>;
  onSelectVersion: (content: string) => void;
}

export function WikiPageHistory({ history, onSelectVersion }: WikiPageHistoryProps) {
  if (!history.length) return null;

  return (
    <div className="mt-4 border rounded-md p-4">
      <h3 className="text-lg font-semibold mb-2">Page History</h3>
      <div className="space-y-2">
        {history.map((revision) => (
          <div
            key={revision.id}
            className="p-2 border rounded hover:bg-accent cursor-pointer"
            onClick={() => onSelectVersion(revision.content)}
          >
            <p className="text-sm text-muted-foreground">
              {new Date(revision.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}