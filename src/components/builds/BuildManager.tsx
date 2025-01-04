import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BuildControls } from "./BuildControls";
import { BuildList } from "./BuildList";

interface BuildManagerProps {
  projectId: string;
}

export function BuildManager({ projectId }: BuildManagerProps) {
  const [selectedBuildId, setSelectedBuildId] = useState<string | null>(null);

  const { data: builds, isLoading } = useQuery({
    queryKey: ["builds", projectId],
    queryFn: async () => {
      console.log("Fetching builds for project:", projectId);
      const { data, error } = await supabase
        .from("builds")
        .select(`
          *,
          build_steps (*)
        `)
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading builds...</div>;
  }

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Build Pipeline</h2>
        <BuildControls projectId={projectId} />
      </div>

      <ScrollArea className="h-[400px] rounded-md border p-4">
        <BuildList
          builds={builds}
          selectedBuildId={selectedBuildId}
          onBuildSelect={setSelectedBuildId}
        />
      </ScrollArea>
    </Card>
  );
}