import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Play, RefreshCw } from "lucide-react";

interface AndroidBuildConfigProps {
  projectId: string;
}

export function AndroidBuildConfig({ projectId }: AndroidBuildConfigProps) {
  const [packageName, setPackageName] = useState("");
  const [versionName, setVersionName] = useState("1.0.0");
  const { toast } = useToast();

  const buildMutation = useMutation({
    mutationFn: async () => {
      if (!packageName) throw new Error("Package name is required");
      
      console.log("Starting Android build for project:", projectId);
      const { data, error } = await supabase
        .from("android_builds")
        .insert({
          project_id: projectId,
          package_name: packageName,
          version_name: versionName,
          status: "pending",
          build_config: {
            minSdkVersion: 21,
            targetSdkVersion: 33,
          }
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Build Started",
        description: "Your Android build has been queued. Check the Build Status tab for updates.",
      });
    },
    onError: (error) => {
      console.error("Error starting build:", error);
      toast({
        title: "Build Failed",
        description: "Failed to start Android build. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-2">
        <Label htmlFor="packageName">Package Name</Label>
        <Input
          id="packageName"
          placeholder="com.example.app"
          value={packageName}
          onChange={(e) => setPackageName(e.target.value)}
        />
        <p className="text-sm text-muted-foreground">
          A unique identifier for your app (e.g., com.yourcompany.appname)
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="versionName">Version Name</Label>
        <Input
          id="versionName"
          placeholder="1.0.0"
          value={versionName}
          onChange={(e) => setVersionName(e.target.value)}
        />
        <p className="text-sm text-muted-foreground">
          The version number shown to users (e.g., 1.0.0)
        </p>
      </div>

      <Button 
        onClick={() => buildMutation.mutate()}
        disabled={!packageName || buildMutation.isPending}
        className="w-full"
      >
        {buildMutation.isPending ? (
          <>
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            Starting Build...
          </>
        ) : (
          <>
            <Play className="w-4 h-4 mr-2" />
            Start Android Build
          </>
        )}
      </Button>
    </Card>
  );
}