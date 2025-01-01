import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

export interface NotificationSettings {
  email: boolean;
  push: boolean;
}

export interface BuildPreferences {
  autoSave: boolean;
  lintOnSave: boolean;
}

export interface EditorPreferences {
  theme: string;
  tabSize: number;
  fontSize: number;
  fontFamily: string;
  lineWrapping: boolean;
}

export interface SecurityPreferences {
  accessLevel: string;
  dataRetentionDays: number;
  apiKeyRotationDays: number;
}

export interface Settings {
  apiKey: string;
  temperature: number;
  maxTokens: number;
  theme: string;
  language: string;
  notifications: NotificationSettings;
  buildPreferences: BuildPreferences;
  editorPreferences: EditorPreferences;
  securityPreferences: SecurityPreferences;
}

export function useSettings() {
  const { toast } = useToast();

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

  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: Partial<Settings>) => {
      console.log("Saving settings...");
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("You must be logged in to change settings");
      }

      const { error } = await supabase
        .from("settings")
        .update(newSettings)
        .eq("user_id", user.id);

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

  return {
    settings,
    isLoading,
    updateSettings: updateSettingsMutation.mutate,
    isUpdating: updateSettingsMutation.isPending,
  };
}