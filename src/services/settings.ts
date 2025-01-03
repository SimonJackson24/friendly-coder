import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type EditorPreferences = {
  theme: string;
  tabSize: number;
  fontSize: number;
  fontFamily: string;
  lineWrapping: boolean;
};

export type SecurityPreferences = {
  accessLevel: string;
  dataRetentionDays: number;
  apiKeyRotationDays: number;
};

export type ModelParameters = {
  model: string;
  contextWindow: number;
};

export const fetchUserSettings = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching settings:", error);
    return { success: false, error };
  }
};

export const updateUserSettings = async (
  userId: string,
  settings: Partial<{
    editor_preferences: EditorPreferences;
    security_preferences: SecurityPreferences;
    model_parameters: ModelParameters;
    theme: string;
    language: string;
  }>
) => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .update(settings)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error updating settings:", error);
    return { success: false, error };
  }
};

export const createInitialSettings = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .insert([{ user_id: userId }])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error creating settings:", error);
    return { success: false, error };
  }
};