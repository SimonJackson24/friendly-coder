import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PackageVersion } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { History } from "lucide-react";

interface VersionHistoryProps {
  packageId: string;
}

export function VersionHistory({ packageId }: VersionHistoryProps) {
  const [versions, setVersions] = useState<PackageVersion[]>([]);

  useEffect(() => {
    fetchVersions();
  }, [packageId]);

  const fetchVersions = async () => {
    try {
      const { data, error } = await supabase
        .from("package_versions")
        .select("*")
        .eq("package_id", packageId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setVersions(data || []);
    } catch (error) {
      console.error('Error fetching versions:', error);
    }
  };

  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-semibold mb-2 flex items-center gap-2">
        <History className="w-5 h-5" />
        Version History
      </h3>
      
      <ScrollArea className="h-[200px]">
        <div className="space-y-2">
          {versions.map((version) => (
            <div
              key={version.id}
              className="p-2 rounded hover:bg-accent flex justify-between items-center"
            >
              <div>
                <div className="font-medium">v{version.version}</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(version.created_at).toLocaleDateString()}
                </div>
              </div>
              {version.changes && (
                <div className="text-sm text-muted-foreground">
                  {version.changes}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}