import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trees, Clock, BookOpen } from "lucide-react";

interface LearningPathCardProps {
  title: string;
  description: string;
  difficulty: string;
  category: string;
  estimatedDuration: number;
  prerequisites: string[];
  progress?: number;
  tutorialCount: number;
}

export function LearningPathCard({
  title,
  description,
  difficulty,
  category,
  estimatedDuration,
  prerequisites,
  progress = 0,
  tutorialCount,
}: LearningPathCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{title}</CardTitle>
          <Badge variant={
            difficulty === 'beginner' ? 'default' :
            difficulty === 'intermediate' ? 'secondary' :
            'destructive'
          }>
            {difficulty}
          </Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{estimatedDuration} mins</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>{tutorialCount} tutorials</span>
            </div>
            <Badge variant="outline">{category}</Badge>
          </div>

          {prerequisites.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Trees className="h-4 w-4" />
                <span>Prerequisites:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {prerequisites.map((prereq, index) => (
                  <Badge key={index} variant="secondary">{prereq}</Badge>
                ))}
              </div>
            </div>
          )}

          {progress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}