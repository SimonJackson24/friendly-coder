import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { GitPullRequest } from "lucide-react";

interface CreatePullRequestProps {
  repositoryId: string;
  sourceBranchId: string;
  targetBranchId: string;
  onPullRequestCreated?: () => void;
}

export function CreatePullRequest({ 
  repositoryId, 
  sourceBranchId, 
  targetBranchId,
  onPullRequestCreated 
}: CreatePullRequestProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const session = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;

    setIsLoading(true);
    try {
      console.log("Creating pull request:", {
        repositoryId,
        title,
        description,
        sourceBranchId,
        targetBranchId,
        authorId: session.user.id
      });

      const { error } = await supabase
        .from("pull_requests")
        .insert({
          repository_id: repositoryId,
          title,
          description,
          source_branch_id: sourceBranchId,
          target_branch_id: targetBranchId,
          author_id: session.user.id,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Pull request created successfully",
      });
      
      setIsOpen(false);
      setTitle("");
      setDescription("");
      onPullRequestCreated?.();
    } catch (error) {
      console.error("Error creating pull request:", error);
      toast({
        title: "Error",
        description: "Failed to create pull request",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <GitPullRequest className="h-4 w-4" />
          Create Pull Request
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Pull Request</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <Textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Pull Request"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}