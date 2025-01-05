import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LearningPathCard } from './LearningPathCard';
import { Skeleton } from '@/components/ui/skeleton';

export function LearningPathList() {
  const { data: learningPaths, isLoading } = useQuery({
    queryKey: ['learningPaths'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('learning_paths')
        .select(`
          *,
          learning_path_tutorials (
            tutorial:tutorials (*)
          )
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[300px]" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {learningPaths?.map((path) => (
        <LearningPathCard
          key={path.id}
          title={path.title}
          description={path.description || ''}
          difficulty={path.difficulty_level}
          category={path.category}
          estimatedDuration={path.estimated_duration || 0}
          prerequisites={path.prerequisites || []}
          tutorialCount={path.learning_path_tutorials?.length || 0}
        />
      ))}
    </div>
  );
}