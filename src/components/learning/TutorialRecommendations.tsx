import { useQuery } from "@tanstack/react-query";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { TutorialCard } from "./TutorialCard";
import { Star, ThumbsUp, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TutorialRecommendations() {
  const session = useSession();

  const { data: userProgress } = useQuery({
    queryKey: ['user-progress', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data, error } = await supabase
        .from('user_progress')
        .select('*, tutorial:tutorials(*)')
        .eq('user_id', session.user.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id
  });

  const { data: recommendations } = useQuery({
    queryKey: ['tutorial-recommendations', session?.user?.id, userProgress],
    queryFn: async () => {
      if (!session?.user?.id) return null;

      // Get user's completed tutorials categories and difficulty levels
      const completedTutorials = userProgress || [];
      const categories = new Set(completedTutorials.map(p => p.tutorial.category));
      const maxDifficulty = completedTutorials.reduce((max, p) => {
        const levels = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
        return Math.max(max, levels[p.tutorial.difficulty_level as keyof typeof levels] || 1);
      }, 0);

      // Query recommendations based on user's progress
      const { data, error } = await supabase
        .from('tutorials')
        .select('*')
        .eq('is_published', true)
        .not('id', 'in', `(${completedTutorials.map(p => p.tutorial_id).join(',')})`)
        .in('category', Array.from(categories))
        .limit(3);

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id && !!userProgress
  });

  if (!session || !recommendations?.length) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Star className="h-5 w-5 text-yellow-500" />
        <h2 className="text-2xl font-semibold">Recommended for You</h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {recommendations.map((tutorial) => (
          <TutorialCard 
            key={tutorial.id} 
            tutorial={tutorial}
          />
        ))}
      </div>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ThumbsUp className="h-5 w-5 text-blue-500" />
            Why these recommendations?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <p>Based on tutorials you've completed</p>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            <p>Matches your interests and skill level</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}