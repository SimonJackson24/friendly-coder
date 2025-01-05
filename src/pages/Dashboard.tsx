import { useSession } from "@supabase/auth-helpers-react";
import { Navigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  LayoutDashboard, 
  BrainCog, 
  Megaphone, 
  GitBranch, 
  Package, 
  Users,
  Settings,
  Activity,
  Clock,
  Star
} from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function Dashboard() {
  const session = useSession();
  const { toast } = useToast();

  // Fetch recent activity
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

  // Fetch user's projects
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

  const features = [
    {
      title: "AI Studio",
      description: "Build and deploy AI-powered applications with real-time assistance",
      icon: BrainCog,
      href: "/assistant",
      color: "text-purple-500"
    },
    {
      title: "Ad Manager",
      description: "Create and optimize ad campaigns with AI-driven insights",
      icon: Megaphone,
      href: "/ads",
      color: "text-blue-500"
    },
    {
      title: "Version Control",
      description: "Manage code versions, branches, and collaborations",
      icon: GitBranch,
      color: "text-green-500",
      href: "/version-control"
    },
    {
      title: "Package Manager",
      description: "Manage dependencies and publish packages",
      icon: Package,
      color: "text-orange-500",
      href: "/packages"
    },
    {
      title: "Team Collaboration",
      description: "Work together with your team in real-time",
      icon: Users,
      color: "text-pink-500",
      href: "/team"
    },
    {
      title: "Project Settings",
      description: "Configure your project settings and integrations",
      icon: Settings,
      color: "text-gray-500",
      href: "/settings"
    }
  ];

  const renderActivityIcon = (type: string) => {
    switch (type) {
      case 'commit':
        return <GitBranch className="h-4 w-4" />;
      case 'build':
        return <Package className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

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

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold">Active Projects</h3>
          </div>
          <p className="text-2xl font-bold mt-2">
            {isLoadingProjects ? "..." : projects?.length || 0}
          </p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold">Recent Updates</h3>
          </div>
          <p className="text-2xl font-bold mt-2">
            {isLoadingActivity ? "..." : recentActivity?.length || 0}
          </p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-green-500" />
            <h3 className="font-semibold">Team Members</h3>
          </div>
          <p className="text-2xl font-bold mt-2">-</p>
        </Card>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {features.map((feature) => (
          <Link key={feature.title} to={feature.href}>
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="flex items-start space-x-4">
                <div className={`${feature.color} p-3 rounded-lg bg-background group-hover:bg-secondary`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-6">Recent Activity</h2>
        <Card className="p-6">
          <div className="space-y-4">
            {isLoadingActivity ? (
              <p>Loading activity...</p>
            ) : recentActivity && recentActivity.length > 0 ? (
              recentActivity.map((activity: any) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className="p-2 rounded-full bg-purple-100 text-purple-500">
                    {renderActivityIcon(activity.type)}
                  </div>
                  <div>
                    <p className="font-medium">{activity.commit_message || 'File updated'}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(activity.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p>No recent activity</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}