import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ReadmePreview({ repositoryId }: { repositoryId: string }) {
  const { data: readme } = useQuery({
    queryKey: ["repo-readme", repositoryId],
    queryFn: async () => {
      console.log("Fetching repository README:", repositoryId);
      const { data, error } = await supabase
        .from("files")
        .select("content")
        .eq("repository_id", repositoryId)
        .eq("path", "README.md")
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (!readme?.content) {
    return (
      <div className="text-muted-foreground">
        No README found. Add a README.md file to display project information.
      </div>
    );
  }

  return (
    <ScrollArea className="h-[300px]">
      <div className="prose prose-sm dark:prose-invert">
        <ReactMarkdown>{readme.content}</ReactMarkdown>
      </div>
    </ScrollArea>
  );
}