import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, RotateCcw, CheckCircle, XCircle, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { DeploymentHistoryRecord } from "@/types/deployment";

interface DeploymentHistoryPanelProps {
  projectId: string;
}

export function DeploymentHistoryPanel({ projectId }: DeploymentHistoryPanelProps) {
  const { data: deployments } = useQuery({
    queryKey: ["deployments", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("deployment_history")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as DeploymentHistoryRecord[];
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <History className="w-5 h-5" />
        <h2 className="text-xl font-semibold">Deployment History</h2>
      </div>

      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {deployments?.map((deployment) => (
            <Card key={deployment.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(deployment.status)}
                  <div>
                    <h4 className="font-medium">
                      {deployment.deployment_config.platform} Deployment
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(deployment.created_at), "PPpp")}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Rollback
                </Button>
              </div>
              {deployment.error_message && (
                <p className="mt-2 text-sm text-red-500">
                  {deployment.error_message}
                </p>
              )}
            </Card>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}