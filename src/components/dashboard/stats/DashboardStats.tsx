import { QuickStats } from "../QuickStats";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function DashboardStats() {
  const { data: projects } = useQuery({
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

  const { data: recentActivity } = useQuery({
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
      return activity;
    }
  });

  return (
    <QuickStats 
      projectCount={projects?.length || 0}
      recentUpdates={recentActivity?.length || 0}
    />
  );
}