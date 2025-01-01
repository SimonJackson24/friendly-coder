import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HuggingFaceSettings } from "@/components/settings/HuggingFaceSettings";

const Settings = () => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState("");
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1000);
  const [computeType, setComputeType] = useState("cpu");
  const [instanceTier, setInstanceTier] = useState("small");

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
            instance_tier: 'small'
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
      const params = settings.model_parameters as { compute_type?: string; instance_tier?: string } || {};
      setComputeType(params.compute_type || "cpu");
      setInstanceTier(params.instance_tier || "small");
    }
  }, [settings]);

  const handleSaveSettings = async () => {
    console.log("Saving settings...");
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
          instance_tier: instanceTier
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

            <Card>
              <CardHeader>
                <CardTitle>Model Parameters</CardTitle>
                <CardDescription>
                  Configure the parameters used for generating content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <Input
                    id="api-key"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your API key"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Temperature: {temperature}</Label>
                  <Slider
                    value={[temperature]}
                    onValueChange={(values) => setTemperature(values[0])}
                    max={1}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Max Tokens: {maxTokens}</Label>
                  <Slider
                    value={[maxTokens]}
                    onValueChange={(values) => setMaxTokens(values[0])}
                    max={2000}
                    step={100}
                    className="w-full"
                  />
                </div>

                <Button onClick={handleSaveSettings} className="w-full">
                  Save Settings
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Settings;