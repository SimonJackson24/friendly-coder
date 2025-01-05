import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Progress } from "@/components/ui/progress";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";

export function TutorialDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0);

  // Fetch tutorial data
  const { data: tutorial, isLoading: isTutorialLoading } = useQuery({
    queryKey: ['tutorial', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tutorials')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch step progress
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

  // Update step progress mutation
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
  const currentStep = steps[currentStepIndex] || {};
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

        <div className="prose prose-gray dark:prose-invert max-w-none">
          {currentStep.title && (
            <h2 className="flex items-center gap-2">
              {currentStep.title}
              {isStepCompleted(currentStepIndex) && (
                <CheckCircle2 className="text-green-500 h-5 w-5" />
              )}
            </h2>
          )}
          <ReactMarkdown>{currentStep.content || tutorial.content}</ReactMarkdown>

          {currentStep.quiz && (
            <div className="bg-card p-4 rounded-lg mt-4">
              <h3 className="text-lg font-semibold mb-3">Quiz</h3>
              <p className="mb-4">{currentStep.quiz.question}</p>
              <div className="space-y-2">
                {currentStep.quiz.options.map((option: string, index: number) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      if (index === currentStep.quiz.correct) {
                        handleCompleteStep();
                        toast({
                          title: "Correct!",
                          description: "You can now move to the next step.",
                        });
                      } else {
                        toast({
                          title: "Try again",
                          description: "That wasn't the correct answer.",
                          variant: "destructive",
                        });
                      }
                    }}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {steps.length > 0 && (
          <div className="flex justify-between items-center pt-4">
            <Button
              variant="outline"
              onClick={handlePreviousStep}
              disabled={currentStepIndex === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <div className="flex gap-2">
              {!isStepCompleted(currentStepIndex) && session && (
                <Button onClick={handleCompleteStep}>
                  Mark as Complete
                </Button>
              )}
              <Button
                onClick={handleNextStep}
                disabled={currentStepIndex === steps.length - 1}
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}