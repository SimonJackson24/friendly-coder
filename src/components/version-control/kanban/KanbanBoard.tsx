import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { KanbanColumn } from "./KanbanColumn";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CreateColumnDialog } from "./CreateColumnDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BoardColumn, ProjectBoard } from "@/types/kanban";
import { useToast } from "@/components/ui/use-toast";

interface KanbanBoardProps {
  repositoryId: string;
}

export function KanbanBoard({ repositoryId }: KanbanBoardProps) {
  const [isCreateColumnOpen, setIsCreateColumnOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: board } = useQuery<ProjectBoard>({
    queryKey: ["project-board", repositoryId],
    queryFn: async () => {
      console.log("Fetching project board for repository:", repositoryId);
      
      const { data: existingBoard, error: boardError } = await supabase
        .from("project_boards")
        .select("*")
        .eq("repository_id", repositoryId)
        .maybeSingle();

      if (boardError) {
        console.error("Error fetching board:", boardError);
        throw boardError;
      }

      if (!existingBoard) {
        console.log("Creating new board for repository");
        const { data: newBoard, error: createError } = await supabase
          .from("project_boards")
          .insert({
            repository_id: repositoryId,
            name: "Default Board",
            description: "Default project board",
            created_by: (await supabase.auth.getUser()).data.user?.id
          })
          .select()
          .single();

        if (createError) throw createError;
        return newBoard;
      }

      return existingBoard;
    },
    enabled: !!repositoryId
  });

  const { data: columns = [] } = useQuery<BoardColumn[]>({
    queryKey: ["board-columns", board?.id],
    queryFn: async () => {
      console.log("Fetching columns for board:", board?.id);
      
      const { data, error } = await supabase
        .from("board_columns")
        .select(`
          id,
          name,
          position,
          board_cards (
            id,
            content,
            position,
            issue_id,
            created_by,
            created_at,
            updated_at
          )
        `)
        .eq("board_id", board?.id)
        .order("position");

      if (error) throw error;

      // Transform the data to match the BoardColumn interface
      return data.map((column: any) => ({
        ...column,
        board_cards: column.board_cards || []
      })) as BoardColumn[];
    },
    enabled: !!board?.id
  });

  const handleCardMove = async (cardId: string, newPosition: number, newColumnId: string) => {
    try {
      const { error } = await supabase
        .from("board_cards")
        .update({ 
          position: newPosition,
          column_id: newColumnId 
        })
        .eq("id", cardId);

      if (error) throw error;

      // Invalidate the columns query to refresh the cards
      queryClient.invalidateQueries({ queryKey: ["board-columns", board?.id] });
    } catch (error) {
      console.error("Error moving card:", error);
      toast({
        title: "Error",
        description: "Failed to move card. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (!board) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <p className="text-muted-foreground">Loading board...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{board.name}</h2>
        <Button onClick={() => setIsCreateColumnOpen(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Column
        </Button>
      </div>

      <ScrollArea className="h-[600px] rounded-md border">
        <div className="flex gap-4 p-4">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={{
                ...column,
                cards: column.board_cards
              }}
              onCardMove={handleCardMove}
            />
          ))}
        </div>
      </ScrollArea>

      <CreateColumnDialog
        boardId={board.id}
        open={isCreateColumnOpen}
        onOpenChange={setIsCreateColumnOpen}
      />
    </div>
  );
}