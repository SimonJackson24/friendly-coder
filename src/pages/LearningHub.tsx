import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TutorialCard } from "@/components/learning/TutorialCard";
import { TutorialProgress } from "@/components/learning/TutorialProgress";
import { Loader2, BookOpen, Code, Rocket, Settings, Package, Git, Bot } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const categories = [
  { id: "getting-started", label: "Getting Started", icon: BookOpen },
  { id: "ai-development", label: "AI Development", icon: Bot },
  { id: "version-control", label: "Version Control", icon: Git },
  { id: "package-management", label: "Package Management", icon: Package },
  { id: "deployment", label: "Deployment", icon: Rocket },
  { id: "advanced", label: "Advanced Features", icon: Code },
  { id: "configuration", label: "Configuration", icon: Settings },
];

export default function LearningHub() {
  const { data: tutorials, isLoading } = useQuery({
    queryKey: ['tutorials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tutorials')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Learning Hub</h1>
          <p className="text-muted-foreground">
            Master the platform with our comprehensive tutorials and guides
          </p>
        </div>

        <TutorialProgress />

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
                {tutorials
                  ?.filter(tutorial => tutorial.category === category.id)
                  .map((tutorial) => (
                    <TutorialCard key={tutorial.id} tutorial={tutorial} />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}