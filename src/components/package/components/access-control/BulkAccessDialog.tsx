import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { AccessLevel } from "../../types";

interface BulkAccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUsers: string[];
  setSelectedUsers: (users: string[]) => void;
  accessLevel: AccessLevel;
  onBulkAccess: () => void;
}

export function BulkAccessDialog({
  open,
  onOpenChange,
  selectedUsers,
  setSelectedUsers,
  accessLevel,
  onBulkAccess,
}: BulkAccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bulk Access Management</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            {selectedUsers.map((userId) => (
              <div
                key={userId}
                className="flex justify-between items-center p-2 bg-accent rounded"
              >
                <span>{userId}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedUsers(users => users.filter(u => u !== userId))}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Input
            placeholder="Add user ID"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const input = e.currentTarget;
                if (input.value && !selectedUsers.includes(input.value)) {
                  setSelectedUsers([...selectedUsers, input.value]);
                  input.value = '';
                }
              }
            }}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={onBulkAccess} disabled={selectedUsers.length === 0}>
              Grant Access to {selectedUsers.length} Users
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}