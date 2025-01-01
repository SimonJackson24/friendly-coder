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

      // Transform snake_case to camelCase
      const transformedSettings: Settings = {
        apiKey: settings?.api_key || "",
        temperature: settings?.temperature || 0.7,
        maxTokens: settings?.max_tokens || 1000,
        theme: settings?.theme || "system",
        language: settings?.language || "en",
        notifications: (settings?.notifications as unknown as NotificationSettings) || { email: true, push: false },
        buildPreferences: (settings?.build_preferences as unknown as BuildPreferences) || { autoSave: true, lintOnSave: true },
        editorPreferences: (settings?.editor_preferences as unknown as EditorPreferences) || {
          theme: "vs-dark",
          tabSize: 2,
          fontSize: 14,
          fontFamily: "monospace",
          lineWrapping: true,
        },
        securityPreferences: (settings?.security_preferences as unknown as SecurityPreferences) || {
          accessLevel: "private",
          dataRetentionDays: 30,
          apiKeyRotationDays: 90,
        },
      };

      console.log("Settings fetched:", transformedSettings);
      return transformedSettings;
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: Partial<Settings>) => {
      console.log("Saving settings...");
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("You must be logged in to change settings");
      }

      // Transform camelCase to snake_case for Supabase
      const transformedSettings = {
        ...(newSettings.apiKey !== undefined && { api_key: newSettings.apiKey }),
        ...(newSettings.temperature !== undefined && { temperature: newSettings.temperature }),
        ...(newSettings.maxTokens !== undefined && { max_tokens: newSettings.maxTokens }),
        ...(newSettings.theme !== undefined && { theme: newSettings.theme }),
        ...(newSettings.language !== undefined && { language: newSettings.language }),
        ...(newSettings.notifications !== undefined && { notifications: newSettings.notifications as unknown as Json }),
        ...(newSettings.buildPreferences !== undefined && { build_preferences: newSettings.buildPreferences as unknown as Json }),
        ...(newSettings.editorPreferences !== undefined && { editor_preferences: newSettings.editorPreferences as unknown as Json }),
        ...(newSettings.securityPreferences !== undefined && { security_preferences: newSettings.securityPreferences as unknown as Json }),
      };

      const { error } = await supabase
        .from("settings")
        .update(transformedSettings)
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