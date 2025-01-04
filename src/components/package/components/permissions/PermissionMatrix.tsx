import { Card } from "@/components/ui/card";
import { Shield, Check, X } from "lucide-react";
import { AccessLevel } from "../../types";

interface Permission {
  name: string;
  read: boolean;
  write: boolean;
  admin: boolean;
}

const PERMISSIONS: Permission[] = [
  { name: "View package details", read: true, write: true, admin: true },
  { name: "Download package", read: true, write: true, admin: true },
  { name: "Update package info", read: false, write: true, admin: true },
  { name: "Publish new versions", read: false, write: true, admin: true },
  { name: "Manage access control", read: false, write: false, admin: true },
  { name: "Delete package", read: false, write: false, admin: true },
];

interface PermissionMatrixProps {
  selectedLevel: AccessLevel;
}

export function PermissionMatrix({ selectedLevel }: PermissionMatrixProps) {
  const getPermissionStatus = (permission: Permission) => {
    switch (selectedLevel) {
      case "read":
        return permission.read;
      case "write":
        return permission.write;
      case "admin":
        return permission.admin;
      default:
        return false;
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5" />
        <h3 className="font-semibold">Permission Matrix</h3>
      </div>

      <div className="space-y-2">
        {PERMISSIONS.map((permission) => (
          <div
            key={permission.name}
            className="flex justify-between items-center p-2 rounded hover:bg-accent"
          >
            <span>{permission.name}</span>
            {getPermissionStatus(permission) ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <X className="w-4 h-4 text-red-500" />
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}