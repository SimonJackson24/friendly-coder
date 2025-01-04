import { SettingsExport } from "@/components/settings/SettingsExport";
import { SettingsImport } from "@/components/settings/SettingsImport";

export function BackupSettingsContainer() {
  return (
    <div className="space-y-4">
      <SettingsExport />
      <SettingsImport />
    </div>
  );
}