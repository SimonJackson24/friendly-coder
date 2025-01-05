import { Card } from "@/components/ui/card";
import { RecentActivity } from "../RecentActivity";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function RecentActivitySection() {
  const { data: recentActivity, isLoading, error } = useQuery({
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

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center p-8">
          <p className="text-red-500 mb-4">Failed to load recent activity</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      );
    }

    if (!recentActivity?.length) {
      return (
        <div className="text-center p-8">
          <p className="text-muted-foreground mb-4">No recent activity</p>
          <Button asChild>
            <Link to="/assistant">Start a New Project</Link>
          </Button>
        </div>
      );
    }

    return <RecentActivity activities={recentActivity} />;
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
      <Card className="p-6">
        {renderContent()}
      </Card>
    </div>
  );
}