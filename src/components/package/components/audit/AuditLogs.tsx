import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Database, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  changes: any;
  created_at: string;
}

export function AuditLogs({ packageId }: { packageId: string }) {
  const { data: auditLogs } = useQuery({
    queryKey: ['audit-logs', packageId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('access_audit_logs')
        .select('*')
        .eq('resource_id', packageId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as AuditLog[];
    }
  });

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Database className="w-5 h-5" />
        <h3 className="font-semibold">Audit Logs</h3>
      </div>

      <ScrollArea className="h-[400px]">
        <div className="space-y-4">
          {auditLogs?.map((log) => (
            <Card key={log.id} className="p-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <div>
                  <p className="text-sm font-medium">
                    {log.action} - {log.resource_type}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(log.created_at), 'PPpp')}
                  </p>
                  {log.changes && (
                    <pre className="mt-2 text-xs bg-muted p-2 rounded">
                      {JSON.stringify(log.changes, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}