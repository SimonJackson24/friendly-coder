import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface CreateReleaseDialogProps {
  repositoryId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateReleaseDialog({
  repositoryId,
  isOpen,
  onOpenChange,
}: CreateReleaseDialogProps) {
  const [version, setVersion] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tagName, setTagName] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleCreate = async () => {
    if (!version.trim() || !tagName.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("releases").insert({
        repository_id: repositoryId,
        version: version.trim(),
        name: name.trim(),
        description: description.trim(),
        tag_name: tagName.trim(),
        created_by: user.id,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Release created successfully",
      });

      setVersion("");
      setName("");
      setDescription("");
      setTagName("");
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["releases", repositoryId] });
    } catch (error) {
      console.error("Error creating release:", error);
      toast({
        title: "Error",
        description: "Failed to create release",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Release</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label htmlFor="version" className="text-sm font-medium">
              Version
            </label>
            <Input
              id="version"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="e.g., 1.0.0"
            />
          </div>

          <div>
            <label htmlFor="tagName" className="text-sm font-medium">
              Tag Name
            </label>
            <Input
              id="tagName"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              placeholder="e.g., v1.0.0"
            />
          </div>

          <div>
            <label htmlFor="name" className="text-sm font-medium">
              Release Name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter release name"
            />
          </div>

          <div>
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter release notes"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create Release</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}