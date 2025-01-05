/**
 * Copyright (c) 2024. All Rights Reserved.
 * 
 * This file is part of the proprietary software developed by the copyright holder.
 * 
 * This software uses the following open source packages under their respective licenses:
 * - @tanstack/react-query: MIT License (https://github.com/tanstack/query/blob/main/LICENSE)
 * - @supabase/auth-helpers-react: MIT License (https://github.com/supabase/auth-helpers/blob/main/LICENSE)
 * - shadcn/ui components: MIT License (https://github.com/shadcn/ui/blob/main/LICENSE.md)
 * 
 * While these dependencies are open source, this file and its contents remain proprietary
 * and may not be copied, modified, or distributed without explicit permission.
 */

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
