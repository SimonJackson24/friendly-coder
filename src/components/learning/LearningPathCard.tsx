/**
 * Copyright (c) 2024. All Rights Reserved.
 */

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Clock, BookOpen, Users } from "lucide-react";

interface LearningPathProps {
  path: {
    id: string;
    title: string;
    description: string;
    difficulty_level: string;
    category: string;
    estimated_duration?: number;
    tutorials?: any[];
  };
  inProgress?: boolean;
}

export function LearningPathCard({ path, inProgress }: LearningPathProps) {
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

  const tutorialCount = path.tutorials?.length || 0;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className={getDifficultyColor(path.difficulty_level)}>
            {path.difficulty_level}
          </Badge>
          <Badge variant="outline">{path.category}</Badge>
        </div>
        <CardTitle className="mt-2">{path.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {path.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="mr-2 h-4 w-4" />
          {path.estimated_duration} min
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <BookOpen className="mr-2 h-4 w-4" />
          {tutorialCount} {tutorialCount === 1 ? 'tutorial' : 'tutorials'}
        </div>
        {inProgress && (
          <div className="flex items-center text-sm text-blue-500">
            <Users className="mr-2 h-4 w-4" />
            Continue path
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={() => navigate(`/learning-path/${path.id}`)}
        >
          {inProgress ? 'Continue Path' : 'Start Path'}
        </Button>
      </CardFooter>
    </Card>
  );
}