import { Button } from "@/components/ui/button";
import { StopCircle, Download } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { BuildStatus } from "./BuildStatus";
import { BuildStepList } from "./BuildStepList";
import { BuildLogs } from "./BuildLogs";

interface BuildListProps {
  builds: any[];
  selectedBuildId: string | null;
  onBuildSelect: (id: string) => void;
}

export function BuildList({ builds, selectedBuildId, onBuildSelect }: BuildListProps) {
  const { toast } = useToast();

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
        // Ensure artifacts_urls is treated as an array of strings
        const artifactUrls = Array.isArray(build.artifacts_urls) 
          ? build.artifacts_urls 
          : typeof build.artifacts_urls === 'string' 
            ? [build.artifacts_urls]
            : [];

        for (const url of artifactUrls) {
          if (typeof url !== 'string') continue;
          
          const { data, error } = await supabase.storage
            .from("build_artifacts")
            .download(url);

          if (error) throw error;
          
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

  return (
    <div className="space-y-4">
      {builds?.map((build) => (
        <div
          key={build.id}
          className="mb-4 p-4 border rounded-lg hover:bg-accent/50 cursor-pointer"
          onClick={() => onBuildSelect(build.id)}
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
              {build.artifacts_urls && Array.isArray(build.artifacts_urls) && build.artifacts_urls.length > 0 && (
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
    </div>
  );
}