import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Clock, BookOpen } from "lucide-react";

interface TutorialCardProps {
  tutorial: {
    id: string;
    title: string;
    content: string;
    difficulty_level: string;
    category: string;
    estimated_duration?: number;
  };
  inProgress?: boolean;
}

export function TutorialCard({ tutorial, inProgress }: TutorialCardProps) {
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

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className={getDifficultyColor(tutorial.difficulty_level)}>
            {tutorial.difficulty_level}
          </Badge>
          <Badge variant="outline">{tutorial.category}</Badge>
        </div>
        <CardTitle className="mt-2">{tutorial.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {tutorial.content}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        {tutorial.estimated_duration && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-2 h-4 w-4" />
            {tutorial.estimated_duration} min
          </div>
        )}
        {inProgress && (
          <div className="flex items-center text-sm text-blue-500">
            <BookOpen className="mr-2 h-4 w-4" />
            Continue learning
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={() => navigate(`/tutorial/${tutorial.id}`)}
        >
          {inProgress ? 'Continue Tutorial' : 'Start Tutorial'}
        </Button>
      </CardFooter>
    </Card>
  );
}