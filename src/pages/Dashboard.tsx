import { useSession } from "@supabase/auth-helpers-react";
import { Navigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const session = useSession();

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

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <DashboardHeader userEmail={session.user.email || ''} />
      
      <QuickStats 
        projectCount={projects?.length || 0}
        recentUpdates={recentActivity?.length || 0}
      />

      <QuickActions />

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