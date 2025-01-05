import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tutorial } from "@/types/tutorial";
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
      return data as Tutorial[];
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
        <Card key={tutorial.id}>
          <CardHeader>
            <CardTitle>{tutorial.title}</CardTitle>
            <div className="flex gap-2 mt-2">
              <Badge>{tutorial.difficulty_level}</Badge>
              <Badge variant="outline">{tutorial.category}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {tutorial.content.substring(0, 150)}...
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};