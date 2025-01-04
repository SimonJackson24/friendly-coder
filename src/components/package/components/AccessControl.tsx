import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Users, UserPlus, Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { PackageAccess, AccessLevel, TeamAccess, AccessRequest } from "../types";
import { TeamAccessSection } from "./access-control/TeamAccessSection";
import { AccessRequestsSection } from "./access-control/AccessRequestsSection";
import { BulkAccessDialog } from "./access-control/BulkAccessDialog";

interface AccessControlProps {
  packageId: string;
}

export function AccessControl({ packageId }: AccessControlProps) {
  const [accessList, setAccessList] = useState<PackageAccess[]>([]);
  const [teamAccess, setTeamAccess] = useState<TeamAccess[]>([]);
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([]);
  const [newUserId, setNewUserId] = useState("");
  const [accessLevel, setAccessLevel] = useState<AccessLevel>("read");
  const [showBulkDialog, setShowBulkDialog] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (packageId) {
      fetchAccessList();
      fetchTeamAccess();
      fetchAccessRequests();
    }
  }, [packageId]);

  const fetchAccessList = async () => {
    try {
      const { data, error } = await supabase
        .from("package_access")
        .select("*")
        .eq("package_id", packageId);

      if (error) throw error;
      setAccessList(data as PackageAccess[]);
    } catch (error) {
      console.error('Error fetching access list:', error);
      toast({
        title: "Error",
        description: "Failed to fetch access list",
        variant: "destructive"
      });
    }
  };

  const fetchTeamAccess = async () => {
    try {
      const { data, error } = await supabase
        .from("team_access")
        .select("*")
        .eq("package_id", packageId);

      if (error) throw error;
      setTeamAccess(data as TeamAccess[]);
    } catch (error) {
      console.error('Error fetching team access:', error);
    }
  };

  const fetchAccessRequests = async () => {
    try {
      const { data, error } = await supabase
        .from("access_requests")
        .select("*")
        .eq("package_id", packageId)
        .eq("status", "pending");

      if (error) throw error;
      setAccessRequests(data as AccessRequest[]);
    } catch (error) {
      console.error('Error fetching access requests:', error);
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

  const handleBulkAccess = async () => {
    try {
      const { error } = await supabase
        .from("package_access")
        .insert(
          selectedUsers.map(userId => ({
            package_id: packageId,
            user_id: userId,
            access_level: accessLevel
          }))
        );

      if (error) throw error;

      toast({
        title: "Success",
        description: "Bulk access granted successfully",
      });

      setSelectedUsers([]);
      setShowBulkDialog(false);
      fetchAccessList();
    } catch (error) {
      console.error('Error granting bulk access:', error);
      toast({
        title: "Error",
        description: "Failed to grant bulk access",
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

  const handleAccessRequest = async (requestId: string, approve: boolean) => {
    try {
      const { error } = await supabase
        .from("access_requests")
        .update({ status: approve ? "approved" : "rejected" })
        .eq("id", requestId);

      if (error) throw error;

      if (approve) {
        const request = accessRequests.find(r => r.id === requestId);
        if (request) {
          await supabase
            .from("package_access")
            .insert({
              package_id: packageId,
              user_id: request.user_id,
              access_level: request.requested_level
            });
        }
      }

      toast({
        title: "Success",
        description: `Access request ${approve ? "approved" : "rejected"} successfully`,
      });

      fetchAccessRequests();
      fetchAccessList();
    } catch (error) {
      console.error('Error handling access request:', error);
      toast({
        title: "Error",
        description: "Failed to handle access request",
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

      <Tabs defaultValue="users">
        <TabsList className="mb-4">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
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
            <Button variant="outline" onClick={() => setShowBulkDialog(true)}>
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
                    onClick={() => handleRevokeAccess(access.id)}
                  >
                    Revoke
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="teams">
          <TeamAccessSection
            teamAccess={teamAccess}
            onRevokeAccess={handleRevokeAccess}
          />
        </TabsContent>

        <TabsContent value="requests">
          <AccessRequestsSection
            accessRequests={accessRequests}
            onHandleRequest={handleAccessRequest}
          />
        </TabsContent>
      </Tabs>

      <BulkAccessDialog
        open={showBulkDialog}
        onOpenChange={setShowBulkDialog}
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
        accessLevel={accessLevel}
        onBulkAccess={handleBulkAccess}
      />
    </div>
  );
}