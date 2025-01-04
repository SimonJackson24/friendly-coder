import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Download, RefreshCw, X } from "lucide-react";

interface AndroidBuildStatusProps {
  projectId: string;
}

type AndroidBuild = {
  apk_url: string | null;
  build_config: any;
  build_logs: string[];
  created_at: string;
  id: string;
  package_name: string;
  project_id: string;
  status: string;
  updated_at: string;
  version_code: number;
  version_name: string;
}

export function AndroidBuildStatus({ projectId }: AndroidBuildStatusProps) {
  const { data: buildData, isLoading } = useQuery<AndroidBuild | null>({
    queryKey: ["android-build", projectId],
    queryFn: async () => {
      console.log("Fetching latest Android build for project:", projectId);
      const { data, error } = await supabase
        .from("android_builds")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching Android build:", error);
        throw error;
      }
      return data;
    },
    refetchInterval: (query) => {
      if (!query.data) return false;
      return query.data.status === "pending" ? 5000 : false;
    },
  });

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span className="ml-2">Loading build status...</span>
        </div>
      </Card>
    );
  }

  if (!buildData) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          No builds found for this project
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Latest Build</h3>
          {buildData.status === "completed" && (
            <span className="text-green-500">
              <Check className="w-5 h-5" />
            </span>
          )}
          {buildData.status === "error" && (
            <span className="text-red-500">
              <X className="w-5 h-5" />
            </span>
          )}
          {buildData.status === "pending" && (
            <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
          )}
        </div>
        {buildData.apk_url && (
          <Button onClick={() => window.open(buildData.apk_url, "_blank")}>
            <Download className="w-4 h-4 mr-2" />
            Download APK
          </Button>
        )}
      </div>

      <div className="grid gap-2">
        <div>
          <span className="font-medium">Package Name:</span> {buildData.package_name}
        </div>
        <div>
          <span className="font-medium">Version:</span> {buildData.version_name}
        </div>
        <div>
          <span className="font-medium">Status:</span>{" "}
          <span className={buildData.status === "completed" ? "text-green-500" : 
                          buildData.status === "error" ? "text-red-500" : 
                          "text-blue-500"}>
            {buildData.status}
          </span>
        </div>
      </div>

      {buildData.build_logs && buildData.build_logs.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Build Logs</h4>
          <ScrollArea className="h-[200px] rounded-md border p-4">
            <pre className="text-sm">
              {buildData.build_logs.join("\n")}
            </pre>
          </ScrollArea>
        </div>
      )}
    </Card>
  );
}