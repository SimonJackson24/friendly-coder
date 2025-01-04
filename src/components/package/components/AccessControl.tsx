import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { PackageAccess, AccessLevel } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { Users, UserPlus, Shield } from "lucide-react";

interface AccessControlProps {
  packageId: string;
}

export function AccessControl({ packageId }: AccessControlProps) {
  const [accessList, setAccessList] = useState<PackageAccess[]>([]);
  const [newUserId, setNewUserId] = useState("");
  const [accessLevel, setAccessLevel] = useState<AccessLevel>("read");
  const { toast } = useToast();

  useEffect(() => {
    fetchAccessList();
  }, [packageId]);

  const isValidAccessLevel = (level: string): level is AccessLevel => {
    return ["read", "write", "admin"].includes(level);
  };

  const fetchAccessList = async () => {
    try {
      const { data, error } = await supabase
        .from("package_access")
        .select("*")
        .eq("package_id", packageId);

      if (error) throw error;

      // Validate and transform the access levels
      const validatedData = (data || []).map(item => {
        if (!isValidAccessLevel(item.access_level)) {
          console.warn(`Invalid access level found: ${item.access_level}, defaulting to "read"`);
          return { ...item, access_level: "read" as AccessLevel };
        }
        return { ...item, access_level: item.access_level as AccessLevel };
      });

      setAccessList(validatedData);
    } catch (error) {
      console.error('Error fetching access list:', error);
    }
  };

  const handleGrantAccess = async () => {
    try {
      const { data, error } = await supabase
        .from("package_access")
        .insert({
          package_id: packageId,
          user_id: newUserId,
          access_level: accessLevel
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Access granted successfully",
      });

      setNewUserId("");
      fetchAccessList();
    } catch (error) {
      console.error('Error granting access:', error);
      toast({
        title: "Error",
        description: "Failed to grant access",
        variant: "destructive",
      });
    }
  };

  const handleRevokeAccess = async (accessId: string) => {
    try {
      const { error } = await supabase
        .from("package_access")
        .delete()
        .eq("id", accessId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Access revoked successfully",
      });

      fetchAccessList();
    } catch (error) {
      console.error('Error revoking access:', error);
      toast({
        title: "Error",
        description: "Failed to revoke access",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Shield className="w-5 h-5" />
        Access Control
      </h3>

      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="User ID"
            value={newUserId}
            onChange={(e) => setNewUserId(e.target.value)}
          />
          <select
            className="border rounded px-2"
            value={accessLevel}
            onChange={(e) => setAccessLevel(e.target.value as AccessLevel)}
          >
            <option value="read">Read</option>
            <option value="write">Write</option>
            <option value="admin">Admin</option>
          </select>
          <Button onClick={handleGrantAccess} disabled={!newUserId}>
            <UserPlus className="w-4 h-4 mr-2" />
            Grant Access
          </Button>
        </div>

        <div className="space-y-2">
          <div className="font-medium flex items-center gap-2">
            <Users className="w-4 h-4" />
            Current Access
          </div>
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
                onClick={() => handleRevokeAccess(access.id)}
              >
                Revoke
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}