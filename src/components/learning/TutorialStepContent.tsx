/**
 * Copyright (c) 2024. All Rights Reserved.
 * 
 * This file is part of the proprietary software developed by the copyright holder.
 * 
 * This software uses the following open source packages under their respective licenses:
 * - React Markdown: MIT License (https://github.com/remarkjs/react-markdown/blob/main/license)
 * - Lucide Icons: MIT License (https://github.com/lucide-icons/lucide/blob/main/LICENSE)
 * - shadcn/ui components: MIT License (https://github.com/shadcn/ui/blob/main/LICENSE.md)
 * 
 * While these dependencies are open source, this file and its contents remain proprietary
 * and may not be copied, modified, or distributed without explicit permission.
 */

import React from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useToast } from "@/hooks/use-toast";
import { TutorialStep } from "@/types/tutorial";

interface StepContentProps {
  step: TutorialStep;
  isCompleted: boolean;
  onComplete: () => void;
}

export function TutorialStepContent({ step, isCompleted, onComplete }: StepContentProps) {
  const { toast } = useToast();

  const handleQuizAnswer = (selectedIndex: number) => {
    if (step.quiz && selectedIndex === step.quiz.correct) {
      onComplete();
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
  };

  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      {step.title && (
        <h2 className="flex items-center gap-2">
          {step.title}
          {isCompleted && <CheckCircle2 className="text-green-500 h-5 w-5" />}
        </h2>
      )}
      <ReactMarkdown>{step.content}</ReactMarkdown>

      {step.quiz && (
        <div className="bg-card p-4 rounded-lg mt-4">
          <h3 className="text-lg font-semibold mb-3">Quiz</h3>
          <p className="mb-4">{step.quiz.question}</p>
          <div className="space-y-2">
            {step.quiz.options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleQuizAnswer(index)}
              >
                {option}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}