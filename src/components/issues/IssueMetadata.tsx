import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tag } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface IssueMetadataProps {
  issueId: string;
  status: string;
  labels: string[] | null;
  assignedTo: string | null;
  users: Array<{ id: string; email: string }>;
  onUpdate: () => void;
}

export function IssueMetadata({ 
  issueId, 
  status, 
  labels, 
  assignedTo, 
  users, 
  onUpdate 
}: IssueMetadataProps) {
  const [newLabel, setNewLabel] = useState("");
  const { toast } = useToast();

  const handleAddLabel = async () => {
    if (!newLabel.trim()) return;

    try {
      const { data: issue } = await supabase
        .from("issues")
        .select("labels")
        .eq("id", issueId)
        .single();

      const updatedLabels = [...(issue?.labels || []), newLabel.trim()];
      const { error } = await supabase
        .from("issues")
        .update({ labels: updatedLabels })
        .eq("id", issueId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Label added successfully",
      });

      setNewLabel("");
      onUpdate();
    } catch (error) {
      console.error("Error adding label:", error);
      toast({
        title: "Error",
        description: "Failed to add label",
        variant: "destructive",
      });
    }
  };

  const handleAssign = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("issues")
        .update({ assigned_to: userId })
        .eq("id", issueId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Issue assigned successfully",
      });

      onUpdate();
    } catch (error) {
      console.error("Error assigning issue:", error);
      toast({
        title: "Error",
        description: "Failed to assign issue",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-64 space-y-6">
      <div>
        <h3 className="font-semibold mb-2">Status</h3>
        <Badge variant={status === "open" ? "default" : "secondary"}>
          {status}
        </Badge>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Assignee</h3>
        <Select
          value={assignedTo || ""}
          onValueChange={handleAssign}
        >
          <SelectTrigger>
            <SelectValue placeholder="Assign to..." />
          </SelectTrigger>
          <SelectContent>
            {users?.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="font-semibold flex items-center gap-2 mb-2">
          <Tag className="w-4 h-4" />
          Labels
        </h3>
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1">
            {labels?.map((label) => (
              <Badge key={label} variant="outline">
                {label}
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="Add label..."
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
            <Button onClick={handleAddLabel} size="sm">
              Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}