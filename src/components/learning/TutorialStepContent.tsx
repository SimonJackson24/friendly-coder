import React from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useToast } from "@/hooks/use-toast";
import { TutorialStep } from "@/types/tutorial";
import { Card } from "@/components/ui/card";

interface StepContentProps {
  step: TutorialStep;
  isCompleted: boolean;
  onComplete: () => void;
}

export function TutorialStepContent({ step, isCompleted, onComplete }: StepContentProps) {
  const { toast } = useToast();

  const handleQuizAnswer = (selectedIndex: number) => {
    if (!step.quiz) return;
    
    if (selectedIndex === step.quiz.correct) {
      onComplete();
      toast({
        title: "Correct!",
        description: "Great job! You can now move to the next step.",
        variant: "default",
      });
    } else {
      toast({
        title: "Try again",
        description: "That wasn't the correct answer. Review the content and try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="prose prose-gray dark:prose-invert max-w-none">
        {step.title && (
          <h2 className="flex items-center gap-2">
            {step.title}
            {isCompleted && <CheckCircle2 className="text-green-500 h-5 w-5" />}
          </h2>
        )}
        
        {step.type === 'reading' && (
          <div className="mb-4 text-muted-foreground">
            Reading time: {step.duration} minutes
          </div>
        )}

        <ReactMarkdown>{step.content || ''}</ReactMarkdown>
      </div>

      {step.quiz && (
        <Card className="p-6 mt-8">
          <h3 className="text-xl font-semibold mb-4">Knowledge Check</h3>
          <p className="mb-6 text-lg">{step.quiz.question}</p>
          <div className="space-y-3">
            {step.quiz.options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start text-left h-auto py-3 px-4"
                onClick={() => handleQuizAnswer(index)}
              >
                {option}
              </Button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}