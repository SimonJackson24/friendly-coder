import { Card } from "@/components/ui/card";
import { Activity, GitBranch, Package } from "lucide-react";

interface ActivityItem {
  id: string;
  type: string;
  commit_message?: string;
  created_at: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
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
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-6">Recent Activity</h2>
      <Card className="p-6">
        <div className="space-y-4">
          {activities && activities.length > 0 ? (
            activities.map((activity) => (
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
  );
}