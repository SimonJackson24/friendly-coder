import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface CreateRepositoryDialogProps {
  projectId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateRepositoryDialog({
  projectId,
  isOpen,
  onOpenChange,
}: CreateRepositoryDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createRepository = useMutation({
    mutationFn: async () => {
      console.log("Creating repository:", { name, description, isPrivate });
      const { data, error } = await supabase
        .from("repositories")
        .insert({
          project_id: projectId,
          name,
          description,
          is_private: isPrivate,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["repositories", projectId] });
      toast({
        title: "Success",
        description: "Repository created successfully",
      });
      onOpenChange(false);
      setName("");
      setDescription("");
      setIsPrivate(true);
    },
    onError: (error) => {
      console.error("Error creating repository:", error);
      toast({
        title: "Error",
        description: "Failed to create repository",
        variant: "destructive",
      });
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Repository</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Repository Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="my-awesome-project"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief description of your repository"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="private">Private Repository</Label>
            <Switch
              id="private"
              checked={isPrivate}
              onCheckedChange={setIsPrivate}
            />
          </div>

          <Button
            className="w-full"
            onClick={() => createRepository.mutate()}
            disabled={!name.trim() || createRepository.isPending}
          >
            Create Repository
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}