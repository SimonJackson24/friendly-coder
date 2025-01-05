import { useSession } from "@supabase/auth-helpers-react";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  LayoutDashboard, 
  BrainCog, 
  Globe, 
  Workflow,
  Smartphone,
  ArrowRightLeft
} from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProjectTypeCard } from "@/components/dashboard/ProjectTypeCard";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { RecentActivity } from "@/components/dashboard/RecentActivity";

export default function Dashboard() {
  const session = useSession();
  const { toast } = useToast();

  const { data: recentActivity, isLoading: isLoadingActivity } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: async () => {
      console.log("Fetching recent activity");
      const { data: activity, error } = await supabase
        .from('version_history')
        .select(`
          id,
          created_at,
          commit_message,
          files!inner(name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error("Error fetching activity:", error);
        throw error;
      }

      return activity;
    }
  });

  const { data: projects, isLoading: isLoadingProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      console.log("Fetching user projects");
      const { data: projects, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error("Error fetching projects:", error);
        throw error;
      }

      return projects;
    }
  });

  if (!session) {
    console.log("No session found, redirecting to login");
    return <Navigate to="/login" />;
  }

  const projectTypes = [
    {
      title: "Responsive Website with PWA",
      description: "Create a modern, responsive website with Progressive Web App capabilities",
      icon: Globe,
      color: "text-blue-500",
      route: "/assistant?type=responsive-pwa"
    },
    {
      title: "Full Stack Web Application",
      description: "Build a complete application with frontend, backend, and database",
      icon: Workflow,
      color: "text-purple-500",
      route: "/assistant?type=fullstack"
    },
    {
      title: "Android App",
      description: "Develop a native Android application from scratch",
      icon: Smartphone,
      color: "text-green-500",
      route: "/assistant?type=android"
    },
    {
      title: "Convert Web App to Android",
      description: "Convert your web application into a native Android app",
      icon: ArrowRightLeft,
      color: "text-orange-500",
      route: "/assistant?type=web-to-android"
    }
  ];

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {session.user.email}
          </p>
        </div>
        <Button asChild>
          <Link to="/assistant">
            <BrainCog className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      <QuickStats 
        projectCount={projects?.length || 0}
        recentUpdates={recentActivity?.length || 0}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {projectTypes.map((type) => (
          <ProjectTypeCard key={type.title} {...type} />
        ))}
      </div>

      <RecentActivity activities={recentActivity || []} />
    </div>
  );
}