import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HuggingFaceModelSelect } from "@/components/settings/HuggingFaceModelSelect";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Settings = () => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState("");
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1000);

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
    if (settings) {
      setApiKey(settings.api_key || "");
      setTemperature(settings.temperature || 0.7);
      setMaxTokens(settings.max_tokens || 1000);
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
        <Card>
          <CardHeader>
            <CardTitle>AI Model Settings</CardTitle>
            <CardDescription>
              Configure the AI models used for generating content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <HuggingFaceModelSelect
                currentModel={settings?.huggingface_model}
              />
            )}

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
      </div>
    </div>
  );
};

export default Settings;