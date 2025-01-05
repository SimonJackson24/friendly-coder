import { Card } from "@/components/ui/card";
import { RecentActivity } from "../RecentActivity";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export function RecentActivitySection() {
  const { toast } = useToast();
  
  const { data: recentActivity, isLoading, error, refetch } = useQuery({
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
        return activity.map(item => ({
          ...item,
          type: 'commit',
          files: Array.isArray(item.files) ? item.files : [item.files]
        }));
      } catch (err) {
        console.error("Failed to fetch activity:", err);
        toast({
          title: "Connection Error",
          description: "Failed to load recent activity. Please try again.",
          variant: "destructive",
        });
        throw err;
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
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
          <Button variant="outline" onClick={() => refetch()}>
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