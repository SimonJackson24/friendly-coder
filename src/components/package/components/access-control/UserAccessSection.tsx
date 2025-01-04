import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserPlus, Users } from "lucide-react";
import { UserAccessProps } from "./types";

export function UserAccessSection({
  accessList,
  newUserId,
  accessLevel,
  onNewUserIdChange,
  onAccessLevelChange,
  onGrantAccess,
  onRevokeAccess,
  onShowBulkDialog,
}: UserAccessProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="User ID"
          value={newUserId}
          onChange={(e) => onNewUserIdChange(e.target.value)}
        />
        <select
          className="border rounded px-2"
          value={accessLevel}
          onChange={(e) => onAccessLevelChange(e.target.value as any)}
        >
          <option value="read">Read</option>
          <option value="write">Write</option>
          <option value="admin">Admin</option>
        </select>
        <Button onClick={onGrantAccess} disabled={!newUserId}>
          <UserPlus className="w-4 h-4 mr-2" />
          Grant Access
        </Button>
        <Button variant="outline" onClick={onShowBulkDialog}>
          <Users className="w-4 h-4 mr-2" />
          Bulk Access
        </Button>
      </div>

      <ScrollArea className="h-[200px]">
        <div className="space-y-2">
          {accessList.map((access) => (
            <div
              key={access.id}
              className="flex justify-between items-center p-2 rounded hover:bg-accent"
            >
              <div>
                <div className="font-medium">{access.user_id}</div>
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
      </ScrollArea>
    </div>
  );
}