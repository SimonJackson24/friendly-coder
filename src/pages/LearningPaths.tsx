import { useEffect, useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { LearningPath } from '@/types/tutorial';

export function LearningPaths() {
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);
  const supabaseClient = useSupabaseClient();

  useEffect(() => {
    async function fetchPaths() {
      const { data: session } = await supabaseClient.auth.getSession();
      if (!session?.user?.id) return;

      const { data, error } = await supabase
        .from('learning_paths')
        .select('*')
        .eq('created_by', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching learning paths:', error);
        return;
      }

      setPaths(data || []);
      setLoading(false);
    }

    fetchPaths();
  }, [supabaseClient]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Learning Paths</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paths.map((path) => (
          <div key={path.id} className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold">{path.title}</h2>
            <p className="text-gray-600">{path.description}</p>
            <div className="mt-2">
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {path.difficulty_level}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}