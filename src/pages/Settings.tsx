import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AIModelSettings } from "@/components/settings/AIModelSettings";
import { DeploymentSettings } from "@/components/settings/DeploymentSettings";
import { PackageSettings } from "@/components/settings/PackageSettings";
import { GitHubSection } from "@/components/settings/GitHubSection";

const Settings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    api_key: "",
    anthropic_model: "claude-3-opus-20240229",
    temperature: 0.7,
    max_tokens: 1000,
    github_token: "", // Changed from github_url to github_token to match DB schema
    default_deployment_platform: "vercel",
    default_package_registry: "npm",
    platform_settings: {},
  });

  const { data: settingsData, isLoading, refetch } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      console.log("Fetching settings...");
      const { data: settings, error } = await supabase
        .from("settings")
        .select("*")
        .maybeSingle();

      if (error) {
        console.error("Error fetching settings:", error);
        throw error;
      }

      console.log("Settings fetched:", settings);
      return settings;
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: any) => {
      console.log("Updating settings:", newSettings);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from("settings")
        .upsert({
          user_id: user.id,
          ...newSettings,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Settings updated successfully",
      });
      refetch();
    },
    onError: (error) => {
      console.error("Error updating settings:", error);
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (settingsData) {
      setSettings({
        api_key: settingsData.api_key || "",
        anthropic_model: settingsData.anthropic_model || "claude-3-opus-20240229",
        temperature: settingsData.temperature || 0.7,
        max_tokens: settingsData.max_tokens || 1000,
        github_token: settingsData.github_token || "", // Changed from github_url to github_token
        default_deployment_platform: settingsData.default_deployment_platform || "vercel",
        default_package_registry: settingsData.default_package_registry || "npm",
        platform_settings: settingsData.platform_settings || {},
      });
    }
  }, [settingsData]);

  const handleSave = () => {
    updateSettingsMutation.mutate(settings);
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
        <div className="space-y-6">
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <Button onClick={handleSave} disabled={updateSettingsMutation.isPending}>
          {updateSettingsMutation.isPending ? "Saving..." : "Save All Settings"}
        </Button>
      </div>
      
      <div className="grid gap-6">
        <AIModelSettings
          apiKey={settings.api_key}
          model={settings.anthropic_model}
          temperature={settings.temperature}
          maxTokens={settings.max_tokens}
          onApiKeyChange={(value) => setSettings(prev => ({ ...prev, api_key: value }))}
          onModelChange={(value) => setSettings(prev => ({ ...prev, anthropic_model: value }))}
          onTemperatureChange={(value) => setSettings(prev => ({ ...prev, temperature: value }))}
          onMaxTokensChange={(value) => setSettings(prev => ({ ...prev, max_tokens: value }))}
        />

        <GitHubSection
          githubUrl={settings.github_token} // Pass github_token as githubUrl prop
          onChange={(value) => setSettings(prev => ({ ...prev, github_token: value }))}
        />

        <DeploymentSettings
          platform={settings.default_deployment_platform}
          platformSettings={settings.platform_settings}
          onPlatformChange={(value) => setSettings(prev => ({ ...prev, default_deployment_platform: value }))}
          onPlatformSettingsChange={(value) => setSettings(prev => ({ ...prev, platform_settings: value }))}
        />

        <PackageSettings
          registry={settings.default_package_registry}
          onRegistryChange={(value) => setSettings(prev => ({ ...prev, default_package_registry: value }))}
        />
      </div>
    </div>
  );
};

export default Settings;