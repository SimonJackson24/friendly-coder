/**
 * Copyright (c) 2024. All Rights Reserved.
 * 
 * This file is part of the proprietary software developed by the copyright holder.
 * 
 * This software uses the following open source packages under their respective licenses:
 * - Lucide Icons: MIT License (https://github.com/lucide-icons/lucide/blob/main/LICENSE)
 * - shadcn/ui components: MIT License (https://github.com/shadcn/ui/blob/main/LICENSE.md)
 * 
 * While these dependencies are open source, this file and its contents remain proprietary
 * and may not be copied, modified, or distributed without explicit permission.
 */

import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface StepNavigationProps {
  currentStepIndex: number;
  totalSteps: number;
  isCurrentStepCompleted: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onComplete: () => void;
  isAuthenticated: boolean;
}

export function TutorialStepNavigation({
  currentStepIndex,
  totalSteps,
  isCurrentStepCompleted,
  onPrevious,
  onNext,
  onComplete,
  isAuthenticated
}: StepNavigationProps) {
  return (
    <div className="flex justify-between items-center pt-4">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentStepIndex === 0}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Previous
      </Button>
      <div className="flex gap-2">
        {!isCurrentStepCompleted && isAuthenticated && (
          <Button onClick={onComplete}>
            Mark as Complete
          </Button>
        )}
        <Button
          onClick={onNext}
          disabled={currentStepIndex === totalSteps - 1}
        >
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}