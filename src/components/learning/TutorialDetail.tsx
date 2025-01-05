/**
 * Copyright (c) 2024. All Rights Reserved.
 * 
 * This file is part of the proprietary software developed by the copyright holder.
 * 
 * This software uses the following open source packages under their respective licenses:
 * - shadcn/ui components: MIT License (https://github.com/shadcn/ui/blob/main/LICENSE.md)
 * - React Router: MIT License (https://github.com/remix-run/react-router/blob/main/LICENSE.md)
 * - Lucide Icons: MIT License (https://github.com/lucide-icons/lucide/blob/main/LICENSE)
 * - React Query: MIT License (https://github.com/TanStack/query/blob/main/LICENSE)
 * 
 * While these dependencies are open source, this file and its contents remain proprietary
 * and may not be copied, modified, or distributed without explicit permission.
 */

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { Tutorial, TutorialResponse, TutorialStep } from "@/types/tutorial";
import { TutorialStepContent } from "./TutorialStepContent";
import { TutorialStepNavigation } from "./TutorialStepNavigation";

const transformTutorialResponse = (response: TutorialResponse): Tutorial => {
  return {
    ...response,
    steps: (response.steps as any[] || []).map((step: any): TutorialStep => ({
      index: step.index,
      title: step.title,
      content: step.content,
      type: step.type,
      duration: step.duration,
      quiz: step.quiz
    })),
    prerequisites: Array.isArray(response.prerequisites) 
      ? response.prerequisites.map(p => String(p))
      : []
  };
};

export function TutorialDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const { data: tutorial, isLoading: isTutorialLoading } = useQuery({
    queryKey: ['tutorial', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tutorials')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return transformTutorialResponse(data as TutorialResponse);
    }
  });

  const { data: stepProgress, isLoading: isProgressLoading } = useQuery({
    queryKey: ['tutorial-step-progress', id, session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data, error } = await supabase
        .from('tutorial_step_progress')
        .select('*')
        .eq('tutorial_id', id)
        .eq('user_id', session.user.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id && !!id
  });

  const updateStepProgress = useMutation({
    mutationFn: async ({ stepIndex, completed }: { stepIndex: number, completed: boolean }) => {
      if (!session?.user?.id) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('tutorial_step_progress')
        .upsert({
          user_id: session.user.id,
          tutorial_id: id,
          step_index: stepIndex,
          completed,
          completed_at: completed ? new Date().toISOString() : null
        }, {
          onConflict: 'user_id,tutorial_id,step_index'
        });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutorial-step-progress'] });
      toast({
        title: "Progress saved",
        description: "Your progress has been updated successfully."
      });
    }
  });

  if (isTutorialLoading || isProgressLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!tutorial) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Tutorial not found</h1>
          <Button onClick={() => navigate('/learning')} className="mt-4">
            <ArrowLeft className="mr-2" />
            Back to Learning Hub
          </Button>
        </div>
      </div>
    );
  }

  const steps = tutorial.steps || [];
  const currentStep = steps[currentStepIndex] || {} as TutorialStep;
  const isStepCompleted = (index: number) => 
    stepProgress?.some(p => p.step_index === index && p.completed) || false;

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleCompleteStep = () => {
    updateStepProgress.mutate({ 
      stepIndex: currentStepIndex, 
      completed: true 
    });
  };

  const getDifficultyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-500/10 text-green-500';
      case 'intermediate':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'advanced':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  const completedSteps = steps.filter((_, index) => isStepCompleted(index)).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/learning')}
        className="mb-6"
      >
        <ArrowLeft className="mr-2" />
        Back to Learning Hub
      </Button>

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className={getDifficultyColor(tutorial.difficulty_level)}>
            {tutorial.difficulty_level}
          </Badge>
          <Badge variant="outline">{tutorial.category}</Badge>
          {tutorial.estimated_duration && (
            <Badge variant="outline">
              {tutorial.estimated_duration} min
            </Badge>
          )}
        </div>

        <h1 className="text-3xl font-bold tracking-tight">{tutorial.title}</h1>

        {session && steps.length > 0 && (
          <div className="space-y-2">
            <Progress value={progressPercentage} className="h-2" />
            <p className="text-sm text-muted-foreground">
              {completedSteps} of {steps.length} steps completed ({Math.round(progressPercentage)}%)
            </p>
          </div>
        )}

        <TutorialStepContent
          step={currentStep}
          isCompleted={isStepCompleted(currentStepIndex)}
          onComplete={handleCompleteStep}
        />

        {steps.length > 0 && (
          <TutorialStepNavigation
            currentStepIndex={currentStepIndex}
            totalSteps={steps.length}
            isCurrentStepCompleted={isStepCompleted(currentStepIndex)}
            onPrevious={handlePreviousStep}
            onNext={handleNextStep}
            onComplete={handleCompleteStep}
            isAuthenticated={!!session}
          />
        )}
      </div>
    </div>
  );
}
