import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

export function TutorialList() {
  const { data: tutorials, isLoading } = useQuery({
    queryKey: ['tutorials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tutorials')
        .select('*')
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
      {tutorials?.map((tutorial) => (
        <div key={tutorial.id} className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold">{tutorial.title}</h3>
          <p className="text-sm text-muted-foreground mt-2">{tutorial.description}</p>
          <div className="flex items-center gap-2 mt-4">
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
              {tutorial.difficulty_level}
            </span>
            <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded">
              {tutorial.category}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}