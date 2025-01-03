import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { fetchUserSettings, createInitialSettings } from "@/services/settings";

type SettingsContextType = {
  settings: any;
  loading: boolean;
  error: Error | null;
  refreshSettings: () => Promise<void>;
};

const SettingsContext = createContext<SettingsContextType>({
  settings: null,
  loading: true,
  error: null,
  refreshSettings: async () => {},
});

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  const { toast } = useToast();
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadSettings = async () => {
    if (!session?.user?.id) return;

    try {
      const { success, data, error } = await fetchUserSettings(session.user.id);
      
      if (!success && error) {
        // If settings don't exist, create initial settings
        if (error.message.includes('not found')) {
          const result = await createInitialSettings(session.user.id);
          if (result.success) {
            setSettings(result.data);
            return;
          }
        }
        throw error;
      }

      setSettings(data);
    } catch (err) {
      console.error("Error loading settings:", err);
      setError(err as Error);
      toast({
        title: "Error",
        description: "Failed to load settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, [session?.user?.id]);

  const refreshSettings = async () => {
    setLoading(true);
    await loadSettings();
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, error, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};