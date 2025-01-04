import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AdPreviewProps {
  content: string;
  platform: string;
}

export function AdPreview({ content, platform }: AdPreviewProps) {
  if (!content) return null;

  return (
    <Card className="p-6 bg-card">
      <h3 className="text-lg font-semibold mb-2 capitalize">{platform} Ad Preview</h3>
      <ScrollArea className="h-[300px] w-full rounded-md border p-4">
        <div className="whitespace-pre-wrap">{content}</div>
      </ScrollArea>
    </Card>
  );
}