import { useSession } from "@supabase/auth-helpers-react";
import { Navigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { useEffect } from "react";

// Add offline support with a custom hook
function useOfflineStatus() {
  const { toast } = useToast();
  
  useEffect(() => {
    const handleOffline = () => {
      toast({
        title: "You're offline",
        description: "Some features may be limited",
        variant: "destructive",
      });
    };
    
    const handleOnline = () => {
      toast({
        title: "You're back online",
        description: "All features are now available",
      });
    };
    
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, [toast]);
}

export default function Dashboard() {
  const session = useSession();
  const { toast } = useToast();
  useOfflineStatus(); // Add offline status monitoring

  // Session expiry check
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.expires_at) {
        const expiryTime = new Date(session.expires_at * 1000);
        const timeUntilExpiry = expiryTime.getTime() - Date.now();
        
        if (timeUntilExpiry < 300000) { // 5 minutes
          toast({
            title: "Session expiring soon",
            description: "Your session will expire in 5 minutes. Please save your work.",
            variant: "warning",
          });
        }
      }
    };
    
    const interval = setInterval(checkSession, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [toast]);

  const { data: recentActivity, isLoading: isLoadingActivity, error: activityError } = useQuery({
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
    },
    meta: {
      errorMessage: "Failed to load recent activity"
    }
  });

  const { data: projects, isLoading: isLoadingProjects, error: projectsError } = useQuery({
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
    },
    meta: {
      errorMessage: "Failed to load your projects"
    }
  });

  if (!session) {
    console.log("No session found, redirecting to login");
    return <Navigate to="/login" />;
  }

  const renderLoadingState = () => (
    <div className="flex items-center justify-center p-8" role="status">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="sr-only">Loading...</span>
    </div>
  );

  const renderError = (message: string) => (
    <Alert variant="destructive" role="alert">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );

  const renderEmptyState = (message: string) => (
    <div className="text-center p-8 border rounded-lg bg-card" role="status">
      <p className="text-muted-foreground mb-4">{message}</p>
      <Button asChild>
        <Link to="/assistant">Create New Project</Link>
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <Breadcrumbs />
      <DashboardHeader userEmail={session.user.email || ''} />
      
      <QuickStats 
        projectCount={projects?.length || 0}
        recentUpdates={recentActivity?.length || 0}
      />

      <QuickActions />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4" id="recent-activity">Recent Activity</h2>
          <div className="bg-card rounded-lg border p-4">
            {isLoadingActivity ? (
              renderLoadingState()
            ) : activityError ? (
              renderError("Failed to load recent activity")
            ) : !recentActivity?.length ? (
              renderEmptyState("No recent activity")
            ) : (
              <RecentActivity activities={recentActivity} />
            )}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4" id="active-projects">Active Projects</h2>
          <div className="bg-card rounded-lg border p-4">
            {isLoadingProjects ? (
              renderLoadingState()
            ) : projectsError ? (
              renderError("Failed to load projects")
            ) : !projects?.length ? (
              renderEmptyState("No active projects")
            ) : (
              <div className="space-y-4">
                {projects.slice(0, 5).map((project) => (
                  <div 
                    key={project.id} 
                    className="flex items-center justify-between p-2 hover:bg-accent rounded-lg transition-colors"
                    role="listitem"
                  >
                    <div>
                      <h3 className="font-medium">{project.title}</h3>
                      <p className="text-sm text-muted-foreground">{project.description}</p>
                    </div>
                    <Button 
                      asChild 
                      variant="ghost" 
                      size="sm"
                      aria-label={`Open ${project.title}`}
                    >
                      <Link to={`/assistant?projectId=${project.id}`}>
                        Open
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}