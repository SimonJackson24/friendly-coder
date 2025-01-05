import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { Tutorial, TutorialStep } from "@/types/tutorial";
import { TutorialStepNavigation } from "./TutorialStepNavigation";
import { TutorialContent } from "./TutorialContent";
import { TutorialHeader } from "./TutorialHeader";

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
      console.log("Fetching tutorial:", id);
      const { data, error } = await supabase
        .from('tutorials')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      // Convert the steps from JSON to proper TutorialStep array
      const parsedTutorial = {
        ...data,
        steps: (data.steps as any[]).map((step: any): TutorialStep => ({
          index: step.index,
          title: step.title,
          content: step.content,
          type: step.type,
          duration: step.duration,
          quiz: step.quiz
        }))
      } as Tutorial;
      
      console.log("Parsed tutorial:", parsedTutorial);
      return parsedTutorial;
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
      console.log("Step progress:", data);
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
          <button onClick={() => navigate('/learning')}>
            Back to Learning Hub
          </button>
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

  const completedSteps = steps.filter((_, index) => isStepCompleted(index)).length;

  return (
    <div className="container mx-auto px-4 py-8">
      <TutorialHeader 
        tutorial={tutorial}
        completedSteps={completedSteps}
        totalSteps={steps.length}
        showProgress={!!session}
      />

      <div className="space-y-6">
        <TutorialContent
          currentStep={currentStep}
          isStepCompleted={isStepCompleted(currentStepIndex)}
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