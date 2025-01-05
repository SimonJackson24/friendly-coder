import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { X, AlertTriangle, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AccessLevel, BulkPermissionOperation } from "../../types";
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
      
      const { error } = await supabase
        .from('package_access')
        .insert(
          userIds.map(userId => ({
            package_id: packageId,
            user_id: userId,
            access_level: accessLevel
          }))
        );

      if (error) throw error;

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
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Bulk Permissions Manager</h3>
      </div>

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
              <div className="flex items-center gap-2">
                <Badge variant={accessLevel === 'admin' ? 'destructive' : 'default'}>
                  {accessLevel}
                </Badge>
                <span>{userId}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveUser(userId)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {userIds.length === 0 && (
            <div className="flex items-center justify-center h-[100px] text-muted-foreground">
              No users added yet
            </div>
          )}
        </div>
      </ScrollArea>

      {userIds.length > 0 && accessLevel === 'admin' && (
        <div className="flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/10 rounded text-sm">
          <AlertTriangle className="w-4 h-4 text-yellow-600" />
          <span>Granting admin access to multiple users - please review carefully</span>
        </div>
      )}

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