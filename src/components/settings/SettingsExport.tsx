import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSettings } from "@/hooks/useSettings";
import { useState } from "react";

export function SettingsExport() {
  const { settings } = useSettings();
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Save export to settings_history
      const { error } = await supabase
        .from('settings_history')
        .insert({
          user_id: user.id,
          settings_data: settings,
          operation_type: 'export',
          description: `Settings exported on ${new Date().toLocaleString()}`
        });

      if (error) throw error;

      // Create downloadable file
      const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `settings-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Settings Exported",
        description: "Your settings have been exported successfully",
      });
    } catch (error) {
      console.error("Error exporting settings:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Export Settings</h3>
      <p className="text-sm text-gray-500 mb-4">
        Download your current settings as a JSON file. You can use this file to restore your settings later.
      </p>
      <Button 
        onClick={handleExport}
        disabled={isExporting}
      >
        {isExporting ? "Exporting..." : "Export Settings"}
      </Button>
    </Card>
  );
}