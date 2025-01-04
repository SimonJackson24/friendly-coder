import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Download, Smartphone, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AndroidBuildSectionProps {
  projectId: string;
}

export function AndroidBuildSection({ projectId }: AndroidBuildSectionProps) {
  const [packageName, setPackageName] = useState("");
  const [versionName, setVersionName] = useState("1.0.0");
  const { toast } = useToast();

  // Query to fetch latest build status
  const { data: latestBuild, isLoading: isLoadingBuild } = useQuery({
    queryKey: ['android-build', projectId],
    queryFn: async () => {
      console.log("Fetching latest Android build for project:", projectId);
      const { data, error } = await supabase
        .from('android_builds')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    refetchInterval: (data) => {
      // Refetch every 5 seconds if build is pending
      return data?.status === 'pending' ? 5000 : false;
    },
  });

  // Mutation to start a new build
  const buildMutation = useMutation({
    mutationFn: async () => {
      if (!packageName) throw new Error("Package name is required");
      
      console.log("Starting Android build for project:", projectId);
      const { data, error } = await supabase
        .from('android_builds')
        .insert({
          project_id: projectId,
          package_name: packageName,
          version_name: versionName,
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
        description: "Your Android build has been queued. You'll be notified when it's ready.",
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

  const handleStartBuild = () => {
    buildMutation.mutate();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Smartphone className="w-5 h-5" />
        <h3 className="text-md font-medium">Android Build Configuration</h3>
      </div>

      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="packageName">Package Name</Label>
          <Input
            id="packageName"
            placeholder="com.example.app"
            value={packageName}
            onChange={(e) => setPackageName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="versionName">Version Name</Label>
          <Input
            id="versionName"
            placeholder="1.0.0"
            value={versionName}
            onChange={(e) => setVersionName(e.target.value)}
          />
        </div>

        {latestBuild && (
          <Alert className={latestBuild.status === 'completed' ? 'bg-green-50' : 'bg-blue-50'}>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Build Status: {latestBuild.status}</AlertTitle>
            <AlertDescription className="space-y-2">
              {latestBuild.status === 'completed' && latestBuild.apk_url && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open(latestBuild.apk_url, '_blank')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download APK
                </Button>
              )}
              {latestBuild.status === 'failed' && (
                <p className="text-red-600">
                  Build failed. Please check the logs and try again.
                </p>
              )}
            </AlertDescription>
          </Alert>
        )}

        <Button 
          onClick={handleStartBuild}
          disabled={!packageName || buildMutation.isPending || isLoadingBuild}
        >
          {buildMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Starting Build...
            </>
          ) : (
            <>
              <Smartphone className="w-4 h-4 mr-2" />
              Start Android Build
            </>
          )}
        </Button>
      </div>
    </div>
  );
}