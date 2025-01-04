import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, Users, Lock } from "lucide-react";
import { PermissionHierarchy } from "../../types";

interface PermissionHierarchyViewProps {
  hierarchy: PermissionHierarchy[];
}

export function PermissionHierarchyView({ hierarchy }: PermissionHierarchyViewProps) {
  const getLevelIndentation = (level: number) => {
    return `ml-${level * 4}`;
  };

  const getPermissionColor = (level: string) => {
    switch (level) {
      case 'admin':
        return 'text-red-500';
      case 'write':
        return 'text-yellow-500';
      default:
        return 'text-green-500';
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5" />
        <h3 className="font-semibold">Permission Hierarchy</h3>
      </div>

      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {hierarchy.map((level) => (
            <div
              key={level.id}
              className={`p-3 border rounded-lg hover:bg-accent transition-colors ${getLevelIndentation(level.level)}`}
            >
              <div className="flex items-center justify-between">
                <div className="font-medium">{level.name}</div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <Lock className="w-4 h-4" />
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground mt-1">
                {level.description}
              </div>

              <div className="mt-2 grid grid-cols-2 gap-2">
                {Object.entries(level.permissions).map(([key, value]) => (
                  <div key={key} className="text-sm flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getPermissionColor(value)}`} />
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