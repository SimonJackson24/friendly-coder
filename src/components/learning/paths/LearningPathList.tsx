import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { Json } from "@/integrations/supabase/types/database";

interface LearningPath {
  id: string;
  title: string;
  description: string;
  difficulty_level: string;
  category: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  is_published: boolean;
  estimated_duration?: number;
  prerequisites: Json[];
}

export const LearningPathList = () => {
  const { data: paths, isLoading } = useQuery({
    queryKey: ["learning-paths"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("learning_paths")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as LearningPath[];
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
      {paths?.map((path) => (
        <Card key={path.id}>
          <CardHeader>
            <CardTitle>{path.title}</CardTitle>
            <div className="flex gap-2 mt-2">
              <Badge>{path.difficulty_level}</Badge>
              <Badge variant="outline">{path.category}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {path.description}
            </p>
            {path.prerequisites && Array.isArray(path.prerequisites) && (
              <div className="mt-4">
                <p className="text-sm font-medium">Prerequisites:</p>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  {(path.prerequisites as string[]).map((prereq, index) => (
                    <li key={index}>{prereq}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};