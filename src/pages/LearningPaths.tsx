import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LearningPath } from '@/integrations/supabase/types/learning';

export default function LearningPaths() {
  const { data: inProgressPaths, isLoading } = useQuery({
    queryKey: ['learning-paths', 'in-progress'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('learning_paths')
        .select('*, user_progress!inner(*)')
        .eq('user_progress.user_id', supabase.auth.user()?.id)
        .is('user_progress.completed_at', null);

      if (error) throw error;
      return data as LearningPath[];
    }
  });

  return (
    <div>
      <h1>In Progress Learning Paths</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {inProgressPaths?.map((path) => (
            <li key={path.id}>{path.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
