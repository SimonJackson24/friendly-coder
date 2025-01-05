import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tutorial } from "@/types/tutorial";
import { useNavigate } from "react-router-dom";

interface TutorialHeaderProps {
  tutorial: Tutorial;
  completedSteps: number;
  totalSteps: number;
  showProgress?: boolean;
}

export function TutorialHeader({ 
  tutorial, 
  completedSteps, 
  totalSteps,
  showProgress = true
}: TutorialHeaderProps) {
  const navigate = useNavigate();

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

  const progressPercentage = (completedSteps / totalSteps) * 100;

  return (
    <div className="space-y-6">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/learning')}
        className="mb-6"
      >
        <ArrowLeft className="mr-2" />
        Back to Learning Hub
      </Button>

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

      {showProgress && totalSteps > 0 && (
        <div className="space-y-2">
          <Progress value={progressPercentage} className="h-2" />
          <p className="text-sm text-muted-foreground">
            {completedSteps} of {totalSteps} steps completed ({Math.round(progressPercentage)}%)
          </p>
        </div>
      )}
    </div>
  );
}