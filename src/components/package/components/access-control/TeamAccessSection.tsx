import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Building } from "lucide-react";
import { TeamAccess } from "../../types";

interface TeamAccessSectionProps {
  teamAccess: TeamAccess[];
  onRevokeAccess: (accessId: string) => void;
}

export function TeamAccessSection({ teamAccess, onRevokeAccess }: TeamAccessSectionProps) {
  return (
    <div className="space-y-2">
      {teamAccess.map((access) => (
        <div
          key={access.id}
          className="flex justify-between items-center p-2 rounded hover:bg-accent"
        >
          <div>
            <div className="font-medium flex items-center gap-2">
              <Building className="w-4 h-4" />
              {access.team_id}
            </div>
            <div className="text-sm text-muted-foreground">
              {access.access_level}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRevokeAccess(access.id)}
          >
            Revoke
          </Button>
        </div>
      ))}
    </div>
  );
}