import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HuggingFaceModelSelect } from "@/components/settings/HuggingFaceModelSelect";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const Settings = () => {
  const { toast } = useToast();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      console.log("Fetching settings...");
      const { data: settings, error } = await supabase
        .from("settings")
        .select("*")
        .single();

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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("settings")
        .insert([{ user_id: user.id }])
        .select()
        .single();

      if (error && error.code !== "23505") { // Ignore unique violation errors
        console.error("Error creating initial settings:", error);
        toast({
          title: "Error",
          description: "Failed to create initial settings",
          variant: "destructive",
        });
      }
    };

    if (!isLoading && !settings) {
      createInitialSettings();
    }
  }, [isLoading, settings, toast]);

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
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <HuggingFaceModelSelect
                currentModel={settings?.huggingface_model}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;