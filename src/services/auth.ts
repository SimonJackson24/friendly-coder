import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const handleSignOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error signing out:", error);
    return { success: false, error };
  }
};