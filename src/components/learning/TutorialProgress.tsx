import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "@supabase/auth-helpers-react";

export function TutorialProgress() {
  const session = useSession();

  const { data: progress } = useQuery({
    queryKey: ['tutorial-progress', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;

      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', session.user.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id
  });

  const { data: totalTutorials } = useQuery({
    queryKey: ['total-tutorials'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('tutorials')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true);
      
      if (error) throw error;
      return count || 0;
    }
  });

  const completedCount = progress?.length || 0;
  const totalCount = totalTutorials || 0;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  if (!session) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Progress value={progressPercentage} className="h-2" />
          <p className="text-sm text-muted-foreground">
            {completedCount} of {totalCount} tutorials completed ({Math.round(progressPercentage)}%)
          </p>
        </div>
      </CardContent>
    </Card>
  );
}