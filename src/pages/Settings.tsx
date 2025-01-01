import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { HuggingFaceSettings } from "@/components/settings/HuggingFaceSettings";
import { ModelParametersSettings } from "@/components/settings/ModelParametersSettings";
import { AutoScalingSettings } from "@/components/settings/AutoScalingSettings";

const Settings = () => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState("");
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1000);
  const [computeType, setComputeType] = useState("cpu");
  const [instanceTier, setInstanceTier] = useState("small");
  const [autoScalingEnabled, setAutoScalingEnabled] = useState(false);
  const [idleTimeout, setIdleTimeout] = useState(15);

  const { data: settings, isLoading, refetch } = useQuery({
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

  useEffect(() => {
    const createInitialSettings = async () => {
      console.log("Creating initial settings...");
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log("No user found, skipping settings creation");
        return;
      }

      const { data, error } = await supabase
        .from("settings")
        .insert([{
          user_id: user.id,
          huggingface_model: 'black-forest-labs/FLUX.1-schnell',
          temperature: 0.7,
          max_tokens: 1000,
          model_parameters: {
            compute_type: 'cpu',
            instance_tier: 'small',
            auto_scaling: {
              enabled: false,
              idle_timeout: 15,
              min_replicas: 0, // Added for HF API compatibility
              max_replicas: 1  // Added for HF API compatibility
            }
          }
        }])
        .select()
        .single();

      if (error && error.code !== "23505") {
        console.error("Error creating initial settings:", error);
        toast({
          title: "Error",
          description: "Failed to create initial settings",
          variant: "destructive",
        });
      } else {
        console.log("Initial settings created:", data);
        refetch();
      }
    };

    if (!isLoading && !settings) {
      createInitialSettings();
    }
  }, [isLoading, settings, toast, refetch]);

  useEffect(() => {
    if (settings) {
      setApiKey(settings.api_key || "");
      setTemperature(settings.temperature || 0.7);
      setMaxTokens(settings.max_tokens || 1000);
      const params = settings.model_parameters as {
        compute_type?: string;
        instance_tier?: string;
        auto_scaling?: {
          enabled: boolean;
          idle_timeout: number;
          min_replicas: number;
          max_replicas: number;
        };
      } || {};
      setComputeType(params.compute_type || "cpu");
      setInstanceTier(params.instance_tier || "small");
      setAutoScalingEnabled(params.auto_scaling?.enabled || false);
      setIdleTimeout(params.auto_scaling?.idle_timeout || 15);
    }
  }, [settings]);

  const handleSaveSettings = async () => {
    console.log("Saving settings with auto-scaling configuration...");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("No user found");
      toast({
        title: "Error",
        description: "You must be logged in to change settings",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("settings")
      .update({
        api_key: apiKey,
        temperature: temperature,
        max_tokens: maxTokens,
        model_parameters: {
          compute_type: computeType,
          instance_tier: instanceTier,
          auto_scaling: {
            enabled: autoScalingEnabled,
            idle_timeout: idleTimeout,
            min_replicas: autoScalingEnabled ? 0 : 1, // Scale to zero if auto-scaling is enabled
            max_replicas: 1 // Maximum of 1 replica for cost control
          }
        }
      })
      .eq("user_id", user.id);

    if (error) {
      console.error("Error updating settings:", error);
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Settings updated successfully",
    });
    refetch();
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <div className="grid gap-6">
        {isLoading ? (
          <Skeleton className="h-[400px] w-full" />
        ) : (
          <>
            <HuggingFaceSettings
              currentModel={settings?.huggingface_model}
              computeType={computeType}
              instanceTier={instanceTier}
              onComputeTypeChange={setComputeType}
              onInstanceTierChange={setInstanceTier}
            />

            <AutoScalingSettings
              autoScalingEnabled={autoScalingEnabled}
              idleTimeout={idleTimeout}
              onAutoScalingChange={setAutoScalingEnabled}
              onIdleTimeoutChange={setIdleTimeout}
            />

            <ModelParametersSettings
              apiKey={apiKey}
              temperature={temperature}
              maxTokens={maxTokens}
              onApiKeyChange={setApiKey}
              onTemperatureChange={setTemperature}
              onMaxTokensChange={setMaxTokens}
              onSave={handleSaveSettings}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Settings;