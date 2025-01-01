import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ModelParametersSettings } from "@/components/settings/ModelParametersSettings";
import { DatabaseStatistics } from "@/components/settings/DatabaseStatistics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralSettings } from "@/components/settings/GeneralSettings";

const Settings = () => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState("");
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1000);
  const [theme, setTheme] = useState("system");
  const [language, setLanguage] = useState("en");
  const [notifications, setNotifications] = useState({ email: true, push: false });
  const [buildPreferences, setBuildPreferences] = useState({
    autoSave: true,
    lintOnSave: true,
  });

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
          temperature: 0.7,
          max_tokens: 1000,
          theme: 'system',
          language: 'en',
          notifications: {
            email: true,
            push: false
          },
          build_preferences: {
            autoSave: true,
            lintOnSave: true
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
      setTheme(settings.theme || "system");
      setLanguage(settings.language || "en");
      // Parse JSON fields with type checking
      const notificationSettings = settings.notifications || { email: true, push: false };
      setNotifications(typeof notificationSettings === 'object' ? notificationSettings : { email: true, push: false });
      
      const buildPrefs = settings.build_preferences || { autoSave: true, lintOnSave: true };
      setBuildPreferences(typeof buildPrefs === 'object' ? buildPrefs : { autoSave: true, lintOnSave: true });
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
        theme,
        language,
        notifications,
        build_preferences: buildPreferences
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
      
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="model">Model</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralSettings
            theme={theme}
            language={language}
            notifications={notifications}
            buildPreferences={buildPreferences}
            onThemeChange={setTheme}
            onLanguageChange={setLanguage}
            onNotificationsChange={setNotifications}
            onBuildPreferencesChange={setBuildPreferences}
            onSave={handleSaveSettings}
          />
        </TabsContent>

        <TabsContent value="model">
          <ModelParametersSettings
            apiKey={apiKey}
            temperature={temperature}
            maxTokens={maxTokens}
            onApiKeyChange={setApiKey}
            onTemperatureChange={setTemperature}
            onMaxTokensChange={setMaxTokens}
            onSave={handleSaveSettings}
          />
        </TabsContent>

        <TabsContent value="database">
          <DatabaseStatistics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;