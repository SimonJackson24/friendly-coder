import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Play, StopCircle, RefreshCw, Download } from "lucide-react";
import { BuildStepList } from "./BuildStepList";
import { BuildLogs } from "./BuildLogs";
import { BuildStatus } from "./BuildStatus";

interface BuildManagerProps {
  projectId: string;
}

export function BuildManager({ projectId }: BuildManagerProps) {
  const [selectedBuildId, setSelectedBuildId] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: builds, isLoading } = useQuery({
    queryKey: ["builds", projectId],
    queryFn: async () => {
      console.log("Fetching builds for project:", projectId);
      const { data, error } = await supabase
        .from("builds")
        .select(`
          *,
          build_steps (*)
        `)
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const startBuildMutation = useMutation({
    mutationFn: async () => {
      console.log("Starting new build for project:", projectId);
      const { data, error } = await supabase.functions.invoke("build-executor", {
        body: { projectId },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Build Started",
        description: "The build pipeline has been initiated",
      });
    },
    onError: (error) => {
      console.error("Build start error:", error);
      toast({
        title: "Error",
        description: "Failed to start build",
        variant: "destructive",
      });
    },
  });

  const stopBuildMutation = useMutation({
    mutationFn: async (buildId: string) => {
      console.log("Stopping build:", buildId);
      const { error } = await supabase
        .from("builds")
        .update({ status: "cancelled" })
        .eq("id", buildId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Build Stopped",
        description: "The build has been cancelled",
      });
    },
  });

  const downloadArtifacts = async (buildId: string) => {
    try {
      console.log("Downloading artifacts for build:", buildId);
      const { data: build } = await supabase
        .from("builds")
        .select("artifacts_urls")
        .eq("id", buildId)
        .single();

      if (build?.artifacts_urls) {
        // Download each artifact
        for (const url of build.artifacts_urls) {
          const { data, error } = await supabase.storage
            .from("build_artifacts")
            .download(url);

          if (error) throw error;
          
          // Create download link
          const blob = new Blob([data]);
          const downloadUrl = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = downloadUrl;
          link.download = url.split("/").pop() || "artifact";
          document.body.appendChild(link);
          link.click();
          link.remove();
        }

        toast({
          title: "Success",
          description: "Artifacts downloaded successfully",
        });
      }
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Error",
        description: "Failed to download artifacts",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading builds...</div>;
  }

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Build Pipeline</h2>
        <div className="space-x-2">
          <Button
            onClick={() => startBuildMutation.mutate()}
            disabled={startBuildMutation.isPending}
          >
            <Play className="h-4 w-4 mr-2" />
            Start Build
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[400px] rounded-md border p-4">
        {builds?.map((build) => (
          <div
            key={build.id}
            className="mb-4 p-4 border rounded-lg hover:bg-accent/50 cursor-pointer"
            onClick={() => setSelectedBuildId(build.id)}
          >
            <div className="flex justify-between items-center">
              <div>
                <BuildStatus status={build.status} />
                <div className="text-sm text-muted-foreground">
                  Build #{build.build_number}
                </div>
              </div>
              <div className="space-x-2">
                {build.status === "running" && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      stopBuildMutation.mutate(build.id);
                    }}
                  >
                    <StopCircle className="h-4 w-4 mr-2" />
                    Stop
                  </Button>
                )}
                {build.artifacts_urls?.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadArtifacts(build.id);
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Artifacts
                  </Button>
                )}
              </div>
            </div>

            {selectedBuildId === build.id && (
              <div className="mt-4">
                <BuildStepList steps={build.build_steps} />
                <BuildLogs buildId={build.id} />
              </div>
            )}
          </div>
        ))}
      </ScrollArea>
    </Card>
  );
}