import { Button } from "@/components/ui/button";
import { Play, RefreshCw } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface BuildControlsProps {
  projectId: string;
}

export function BuildControls({ projectId }: BuildControlsProps) {
  const { toast } = useToast();

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

  return (
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
  );
}