import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface CreateCardDialogProps {
  columnId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateCardDialog({ 
  columnId, 
  open, 
  onOpenChange 
}: CreateCardDialogProps) {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsLoading(true);
    try {
      console.log("Creating new card in column:", columnId);
      
      // Get the highest position
      const { data: cards } = await supabase
        .from("board_cards")
        .select("position")
        .eq("column_id", columnId)
        .order("position", { ascending: false })
        .limit(1);

      const nextPosition = cards?.[0]?.position ?? 0;

      const { error } = await supabase
        .from("board_cards")
        .insert({
          column_id: columnId,
          content: content.trim(),
          position: nextPosition + 1
        });

      if (error) throw error;

      toast({
        title: "Card created",
        description: "The card has been created successfully."
      });

      // Invalidate the columns query to refresh the cards
      const { data: column } = await supabase
        .from("board_columns")
        .select("board_id")
        .eq("id", columnId)
        .single();

      if (column) {
        queryClient.invalidateQueries({ queryKey: ["board-columns", column.board_id] });
      }

      onOpenChange(false);
      setContent("");
    } catch (error) {
      console.error("Error creating card:", error);
      toast({
        title: "Error",
        description: "Failed to create card. Please try again.",
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
          <DialogTitle>Create New Card</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Card content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
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
              Create Card
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}