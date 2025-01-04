import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, Users, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PermissionHierarchy, PackageAccess, TeamAccess } from "../../types";

interface PermissionVisualizationProps {
  packageId: string;
  accessList?: PackageAccess[];
  teamAccess?: TeamAccess[];
}

export function PermissionVisualization({ packageId, accessList, teamAccess }: PermissionVisualizationProps) {
  const { data: hierarchy } = useQuery({
    queryKey: ['permission-hierarchy', packageId],
    queryFn: async () => {
      const { data: templates } = await supabase
        .from('permission_templates')
        .select('*')
        .eq('package_id', packageId);

      // Convert templates to hierarchy
      const hierarchyData: PermissionHierarchy[] = (templates || []).map(template => ({
        id: template.id,
        name: template.name,
        level: 0,
        permissions: template.permissions as Record<string, any>,
        description: template.description
      }));

      return hierarchyData;
    }
  });

  const totalUsers = accessList?.length || 0;
  const totalTeams = teamAccess?.length || 0;

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Permission Overview
        </h3>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {totalUsers} Users
          </div>
          <div className="flex items-center gap-1">
            <Lock className="w-4 h-4" />
            {totalTeams} Teams
          </div>
        </div>
      </div>

      <ScrollArea className="h-[300px]">
        <div className="space-y-4">
          {hierarchy?.map((level) => (
            <div
              key={level.id}
              className="p-3 border rounded-lg hover:bg-accent transition-colors"
            >
              <div className="font-medium">{level.name}</div>
              <div className="text-sm text-muted-foreground">{level.description}</div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {Object.entries(level.permissions).map(([key, value]) => (
                  <div key={key} className="text-sm flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      value === 'admin' ? 'bg-red-500' :
                      value === 'write' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`} />
                    {key}: {value}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}