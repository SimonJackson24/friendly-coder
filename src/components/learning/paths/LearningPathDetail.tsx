import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tree, Clock, BookOpen } from "lucide-react";
import { TutorialCard } from '../TutorialCard';
import { Skeleton } from '@/components/ui/skeleton';

export function LearningPathDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: learningPath, isLoading } = useQuery({
    queryKey: ['learningPath', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('learning_paths')
        .select(`
          *,
          learning_path_tutorials (
            tutorial:tutorials (*)
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-[200px]" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[300px]" />
          ))}
        </div>
      </div>
    );
  }

  if (!learningPath) {
    return <div>Learning path not found</div>;
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{learningPath.title}</CardTitle>
              <CardDescription className="mt-2">{learningPath.description}</CardDescription>
            </div>
            <Badge variant={
              learningPath.difficulty_level === 'beginner' ? 'default' :
              learningPath.difficulty_level === 'intermediate' ? 'secondary' :
              'destructive'
            }>
              {learningPath.difficulty_level}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{learningPath.estimated_duration} mins</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span>{learningPath.learning_path_tutorials?.length || 0} tutorials</span>
              </div>
              <Badge variant="outline">{learningPath.category}</Badge>
            </div>

            {learningPath.prerequisites?.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Tree className="h-4 w-4" />
                  <span className="font-medium">Prerequisites:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {learningPath.prerequisites.map((prereq: string, index: number) => (
                    <Badge key={index} variant="secondary">{prereq}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Tutorials in this path</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {learningPath.learning_path_tutorials
            ?.sort((a: any, b: any) => a.order_index - b.order_index)
            .map((item: any) => (
              <TutorialCard
                key={item.tutorial.id}
                tutorial={item.tutorial}
              />
            ))}
        </div>
      </div>
    </div>
  );
}