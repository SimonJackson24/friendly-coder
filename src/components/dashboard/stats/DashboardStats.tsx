import { QuickStats } from "../QuickStats";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function DashboardStats() {
  const { toast } = useToast();

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      console.log("Fetching user projects");
      try {
        const { data: projects, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error fetching projects:", error);
          throw error;
        }

        console.log("Successfully fetched projects:", projects);
        return projects;
      } catch (err) {
        console.error("Failed to fetch projects:", err);
        toast({
          title: "Connection Error",
          description: "Failed to load project stats. Please try again.",
          variant: "destructive",
        });
        throw err;
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  const { data: recentActivity } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: async () => {
      console.log("Fetching recent activity");
      try {
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

        console.log("Successfully fetched activity:", activity);
        return activity;
      } catch (err) {
        console.error("Failed to fetch activity:", err);
        toast({
          title: "Connection Error",
          description: "Failed to load activity stats. Please try again.",
          variant: "destructive",
        });
        throw err;
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  return (
    <QuickStats 
      projectCount={projects?.length || 0}
      recentUpdates={recentActivity?.length || 0}
    />
  );
}