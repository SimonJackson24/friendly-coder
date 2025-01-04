import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface CreateBranchDialogProps {
  repositoryId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateBranchDialog({
  repositoryId,
  isOpen,
  onOpenChange,
}: CreateBranchDialogProps) {
  const [name, setName] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createBranch = useMutation({
    mutationFn: async () => {
      console.log("Creating branch:", { name, repositoryId });
      const { data, error } = await supabase
        .from("branches")
        .insert({
          name,
          repository_id: repositoryId,
          is_default: false,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches", repositoryId] });
      toast({
        title: "Success",
        description: "Branch created successfully",
      });
      onOpenChange(false);
      setName("");
    },
    onError: (error) => {
      console.error("Error creating branch:", error);
      toast({
        title: "Error",
        description: "Failed to create branch",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createBranch.mutate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Branch</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Branch Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="feature/new-feature"
            />
          </div>
          <Button type="submit" disabled={!name.trim() || createBranch.isPending}>
            {createBranch.isPending ? "Creating..." : "Create Branch"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}