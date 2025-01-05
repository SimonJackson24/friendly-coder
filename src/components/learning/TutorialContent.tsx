import React from "react";
import { TutorialStep } from "@/types/tutorial";
import { TutorialStepContent } from "./TutorialStepContent";

interface TutorialContentProps {
  currentStep: TutorialStep;
  isStepCompleted: boolean;
  onComplete: () => void;
}

export function TutorialContent({ 
  currentStep, 
  isStepCompleted, 
  onComplete 
}: TutorialContentProps) {
  return (
    <div className="space-y-6">
      <TutorialStepContent
        step={currentStep}
        isCompleted={isStepCompleted}
        onComplete={onComplete}
      />
    </div>
  );
}