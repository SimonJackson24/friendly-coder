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
  ArrowRightLeft,
  GitBranch,
  Package,
  Users,
  Settings,
  Activity
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
          files(name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error("Error fetching activity:", error);
        throw error;
      }

      return activity.map(item => ({
        ...item,
        type: 'commit',
        files: Array.isArray(item.files) ? item.files : [item.files]
      }));
    }
  });

  const { data: projects, isLoading: isLoadingProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      console.log("Fetching user projects");
      const { data: projects, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

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
    },
    {
      title: "Version Control",
      description: "Manage your code with Git-based version control",
      icon: GitBranch,
      color: "text-indigo-500",
      route: "/version-control"
    },
    {
      title: "Package Management",
      description: "Manage and publish packages for your projects",
      icon: Package,
      color: "text-pink-500",
      route: "/packages"
    },
    {
      title: "Team Collaboration",
      description: "Work together with your team members",
      icon: Users,
      color: "text-teal-500",
      route: "/team"
    },
    {
      title: "Project Settings",
      description: "Configure your project settings and preferences",
      icon: Settings,
      color: "text-gray-500",
      route: "/settings"
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
        <div className="flex gap-4">
          <Button asChild variant="outline">
            <Link to="/version-control">
              <GitBranch className="mr-2 h-4 w-4" />
              Version Control
            </Link>
          </Button>
          <Button asChild>
            <Link to="/assistant">
              <BrainCog className="mr-2 h-4 w-4" />
              New Project
            </Link>
          </Button>
        </div>
      </div>

      <QuickStats 
        projectCount={projects?.length || 0}
        recentUpdates={recentActivity?.length || 0}
      />

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projectTypes.map((type) => (
            <ProjectTypeCard key={type.title} {...type} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
          <div className="bg-card rounded-lg border p-4">
            {isLoadingActivity ? (
              <p className="text-muted-foreground">Loading activity...</p>
            ) : (
              <RecentActivity activities={recentActivity || []} />
            )}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Active Projects</h2>
          <div className="bg-card rounded-lg border p-4">
            {isLoadingProjects ? (
              <p className="text-muted-foreground">Loading projects...</p>
            ) : projects?.length > 0 ? (
              <div className="space-y-4">
                {projects.slice(0, 5).map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-2 hover:bg-accent rounded-lg">
                    <div>
                      <h3 className="font-medium">{project.title}</h3>
                      <p className="text-sm text-muted-foreground">{project.description}</p>
                    </div>
                    <Button asChild variant="ghost" size="sm">
                      <Link to={`/assistant?projectId=${project.id}`}>
                        Open
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No active projects</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}