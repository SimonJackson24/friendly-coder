import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AndroidPreviewProps {
  projectId: string;
}

export function AndroidPreview({ projectId }: AndroidPreviewProps) {
  const { data: files, isLoading } = useQuery({
    queryKey: ["project-files", projectId],
    queryFn: async () => {
      console.log("Fetching files for Android preview:", projectId);
      const { data, error } = await supabase
        .from("files")
        .select("*")
        .eq("project_id", projectId);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-[400px] w-full" />
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Project Files</h3>
        <ScrollArea className="h-[400px]">
          <div className="space-y-2">
            {files?.map((file) => (
              <div
                key={file.id}
                className="p-2 rounded-md hover:bg-accent"
              >
                <div className="font-medium">{file.name}</div>
                <div className="text-sm text-muted-foreground">{file.path}</div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
}