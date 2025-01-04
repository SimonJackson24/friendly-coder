import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Commit {
  id: string;
  message: string;
  created_at: string;
  author_id: string;
  branch_id: string;
}

export function CommitHistory({ branchId }: { branchId: string }) {
  const { data: commits, isLoading } = useQuery({
    queryKey: ["commits", branchId],
    queryFn: async () => {
      console.log("Fetching commits for branch:", branchId);
      const { data, error } = await supabase
        .from("commits")
        .select("*")
        .eq("branch_id", branchId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching commits:", error);
        throw error;
      }

      return data as Commit[];
    },
    enabled: !!branchId,
  });

  if (isLoading) {
    return <div>Loading commits...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Commit History</h2>
      <ScrollArea className="h-[400px]">
        <div className="space-y-2">
          {commits?.map((commit) => (
            <div
              key={commit.id}
              className="p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <h3 className="font-semibold">{commit.message}</h3>
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <span>Committed on {new Date(commit.created_at).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}