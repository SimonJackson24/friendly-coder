import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";

interface CreateIssueDialogProps {
  repositoryId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateIssueDialog({
  repositoryId,
  isOpen,
  onOpenChange,
}: CreateIssueDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    console.log("Creating new issue:", { title, description, repositoryId });

    try {
      const { error } = await supabase.from("issues").insert({
        repository_id: repositoryId,
        title: title.trim(),
        description: description.trim(),
        status: "open",
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Issue created successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["issues", repositoryId] });
      onOpenChange(false);
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Error creating issue:", error);
      toast({
        title: "Error",
        description: "Failed to create issue. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Issue</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Issue title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue..."
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Issue"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}