/**
 * Copyright (c) 2024. All Rights Reserved.
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LearningPathCard } from "@/components/learning/LearningPathCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSession } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { Search, BookOpen, Code, Rocket, Settings, Package, GitBranch, Bot } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const categories = [
  { id: "getting-started", label: "Getting Started", icon: BookOpen },
  { id: "ai-development", label: "AI Development", icon: Bot },
  { id: "version-control", label: "Version Control", icon: GitBranch },
  { id: "package-management", label: "Package Management", icon: Package },
  { id: "deployment", label: "Deployment", icon: Rocket },
  { id: "advanced", label: "Advanced Features", icon: Code },
  { id: "configuration", label: "Configuration", icon: Settings },
];

const difficultyLevels = ["all", "beginner", "intermediate", "advanced"];
const sortOptions = ["newest", "oldest", "title-asc", "title-desc"];

interface LearningPath {
  id: string;
  title: string;
  description: string;
  difficulty_level: string;
  category: string;
  estimated_duration?: number;
  tutorials?: any[];
}

export default function LearningPaths() {
  const session = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const { data: learningPaths, isLoading } = useQuery({
    queryKey: ['learning-paths'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('learning_paths')
        .select('*, tutorials:learning_path_tutorials(tutorial:tutorials(*))')
        .eq('is_published', true)
        .order('created_at', { ascending: sortBy === 'oldest' });
      
      if (error) throw error;
      return (data || []) as LearningPath[];
    }
  });

  const { data: inProgressPaths = [] } = useQuery({
    queryKey: ['in-progress-paths', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_progress')
        .select('learning_path:learning_paths(*)')
        .eq('user_id', session.user.id)
        .is('completed_at', null);
      
      if (error) return [];
      return (data || []).map(progress => progress.learning_path) as LearningPath[];
    },
    enabled: !!session?.user?.id
  });

  const filteredPaths = learningPaths?.filter(path => {
    const matchesSearch = path.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         path.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'all' || path.difficulty_level === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  const sortedPaths = [...(filteredPaths || [])].sort((a, b) => {
    if (sortBy === 'title-asc') return a.title.localeCompare(b.title);
    if (sortBy === 'title-desc') return b.title.localeCompare(a.title);
    return 0;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Learning Paths</h1>
          <p className="text-muted-foreground">
            Follow structured learning paths to master different aspects of the platform
          </p>
        </div>

        {session && inProgressPaths.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Continue Learning</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {inProgressPaths.map((path) => (
                <LearningPathCard 
                  key={path.id} 
                  path={path}
                  inProgress={true}
                />
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search learning paths..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              {difficultyLevels.map((level) => (
                <SelectItem key={level} value={level} className="capitalize">
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option} value={option} className="capitalize">
                  {option.replace('-', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="getting-started" className="space-y-4">
          <TabsList className="grid grid-cols-2 lg:grid-cols-7 h-auto gap-4">
            {categories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="flex items-center gap-2 data-[state=active]:bg-primary"
              >
                <category.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{category.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {sortedPaths
                  ?.filter(path => path.category === category.id)
                  .map((path) => (
                    <LearningPathCard key={path.id} path={path} />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}