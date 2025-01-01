import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DatabaseDownload } from "@/components/database/DatabaseDownload";
import { InfoIcon } from "lucide-react";

interface DatabaseSectionProps {
  project: any;
}

export function DatabaseSection({ project }: DatabaseSectionProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Database Settings</h3>
      
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          Manage your project's database settings and export data for backup purposes.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <Card className="p-4">
          <h4 className="font-medium mb-2">Database Exports</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Download a backup of your project's database
          </p>
          <DatabaseDownload />
        </Card>
      </div>
    </div>
  );
}