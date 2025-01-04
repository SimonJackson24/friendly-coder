import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { AccessLevel } from "../../types";
import { PermissionTemplateSelector } from "./PermissionTemplateSelector";

interface BulkPermissionsManagerProps {
  packageId: string;
  onPermissionsUpdated: () => void;
}

export function BulkPermissionsManager({ packageId, onPermissionsUpdated }: BulkPermissionsManagerProps) {
  const [userIds, setUserIds] = useState<string[]>([]);
  const [newUserId, setNewUserId] = useState("");
  const [accessLevel, setAccessLevel] = useState<AccessLevel>("read");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAddUser = () => {
    if (newUserId && !userIds.includes(newUserId)) {
      setUserIds([...userIds, newUserId]);
      setNewUserId("");
    }
  };

  const handleRemoveUser = (userId: string) => {
    setUserIds(userIds.filter(id => id !== userId));
  };

  const handleGrantAccess = async () => {
    if (userIds.length === 0) return;

    setIsLoading(true);
    try {
      console.log('Granting bulk access to users:', userIds);
      
      // First, save the permission template
      const { data: template, error: templateError } = await supabase
        .from('permission_templates')
        .insert({
          name: `Bulk ${accessLevel} access`,
          permissions: { accessLevel }
        })
        .select()
        .single();

      if (templateError) throw templateError;

      // Then grant access to all users
      const { error: accessError } = await supabase
        .from('package_access')
        .insert(
          userIds.map(userId => ({
            package_id: packageId,
            user_id: userId,
            access_level: accessLevel
          }))
        );

      if (accessError) throw accessError;

      toast({
        title: "Success",
        description: `Granted ${accessLevel} access to ${userIds.length} users`
      });

      setUserIds([]);
      onPermissionsUpdated();
    } catch (error) {
      console.error('Error granting bulk access:', error);
      toast({
        title: "Error",
        description: "Failed to grant bulk access",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Add user ID"
          value={newUserId}
          onChange={(e) => setNewUserId(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddUser()}
        />
        <Button onClick={handleAddUser}>Add</Button>
      </div>

      <Select value={accessLevel} onValueChange={(value) => setAccessLevel(value as AccessLevel)}>
        <SelectTrigger>
          <SelectValue placeholder="Select access level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="read">Read</SelectItem>
          <SelectItem value="write">Write</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
        </SelectContent>
      </Select>

      <ScrollArea className="h-[200px] border rounded-md p-2">
        <div className="space-y-2">
          {userIds.map((userId) => (
            <div key={userId} className="flex justify-between items-center p-2 bg-accent rounded">
              <span>{userId}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveUser(userId)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>

      <Button 
        onClick={handleGrantAccess} 
        disabled={isLoading || userIds.length === 0}
        className="w-full"
      >
        {isLoading ? "Granting access..." : `Grant ${accessLevel} access to ${userIds.length} users`}
      </Button>
    </div>
  );
}