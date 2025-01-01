import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSettings } from "@/hooks/useSettings";
import { useState } from "react";

export function SettingsImport() {
  const { updateSettings } = useSettings();
  const { toast } = useToast();
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const fileContent = await file.text();
      const importedSettings = JSON.parse(fileContent);

      // Save import to settings_history
      const { error } = await supabase
        .from('settings_history')
        .insert({
          user_id: user.id,
          settings_data: importedSettings,
          operation_type: 'import',
          description: `Settings imported from ${file.name}`
        });

      if (error) throw error;

      // Update settings
      await updateSettings(importedSettings);

      toast({
        title: "Settings Imported",
        description: "Your settings have been imported successfully",
      });
    } catch (error) {
      console.error("Error importing settings:", error);
      toast({
        title: "Import Failed",
        description: "Failed to import settings. Please check the file format and try again.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
      // Reset file input
      event.target.value = '';
    }
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Import Settings</h3>
      <p className="text-sm text-gray-500 mb-4">
        Import settings from a previously exported JSON file.
      </p>
      <input
        type="file"
        accept=".json"
        onChange={handleImport}
        disabled={isImporting}
        className="hidden"
        id="settings-import"
      />
      <Button 
        onClick={() => document.getElementById('settings-import')?.click()}
        disabled={isImporting}
      >
        {isImporting ? "Importing..." : "Import Settings"}
      </Button>
    </Card>
  );
}