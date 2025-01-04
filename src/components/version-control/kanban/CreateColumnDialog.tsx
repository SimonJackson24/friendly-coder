import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface CreateColumnDialogProps {
  boardId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateColumnDialog({ 
  boardId, 
  open, 
  onOpenChange 
}: CreateColumnDialogProps) {
  const [columnName, setColumnName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!columnName.trim()) return;

    setIsLoading(true);
    try {
      console.log("Creating new column:", columnName);
      
      // Get the highest position
      const { data: columns } = await supabase
        .from("board_columns")
        .select("position")
        .eq("board_id", boardId)
        .order("position", { ascending: false })
        .limit(1);

      const nextPosition = columns?.[0]?.position ?? 0;

      const { error } = await supabase
        .from("board_columns")
        .insert({
          board_id: boardId,
          name: columnName.trim(),
          position: nextPosition + 1
        });

      if (error) throw error;

      toast({
        title: "Column created",
        description: "The column has been created successfully."
      });

      queryClient.invalidateQueries({ queryKey: ["board-columns", boardId] });
      onOpenChange(false);
      setColumnName("");
    } catch (error) {
      console.error("Error creating column:", error);
      toast({
        title: "Error",
        description: "Failed to create column. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Column</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Column name"
            value={columnName}
            onChange={(e) => setColumnName(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              Create Column
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}