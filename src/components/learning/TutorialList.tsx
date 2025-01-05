import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tutorial, TutorialStep } from "@/types/tutorial";
import { TutorialCard } from "./TutorialCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

export const TutorialList = () => {
  const { data: tutorials, isLoading } = useQuery({
    queryKey: ["tutorials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tutorials")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform the data to match the Tutorial interface
      return (data as any[]).map((tutorial): Tutorial => ({
        ...tutorial,
        steps: (tutorial.steps as any[])?.map((step): TutorialStep => ({
          index: step.index,
          title: step.title,
          content: step.content,
          type: step.type,
          duration: step.duration,
          quiz: step.quiz
        })) || []
      }));
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tutorials?.map((tutorial) => (
        <TutorialCard key={tutorial.id} tutorial={tutorial} />
      ))}
    </div>
  );
};