import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { KanbanColumn } from "./KanbanColumn";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CreateColumnDialog } from "./CreateColumnDialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface KanbanBoardProps {
  repositoryId: string;
}

interface BoardColumn {
  id: string;
  name: string;
  position: number;
  cards: BoardCard[];
}

interface BoardCard {
  id: string;
  content: string;
  position: number;
  issue_id?: string;
}

export function KanbanBoard({ repositoryId }: KanbanBoardProps) {
  const [isCreateColumnOpen, setIsCreateColumnOpen] = useState(false);

  const { data: board } = useQuery({
    queryKey: ["project-board", repositoryId],
    queryFn: async () => {
      console.log("Fetching project board for repository:", repositoryId);
      
      const { data: existingBoard, error: boardError } = await supabase
        .from("project_boards")
        .select("*")
        .eq("repository_id", repositoryId)
        .single();

      if (boardError && boardError.code !== "PGRST116") {
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
            description: "Default project board"
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

  const { data: columns = [] } = useQuery({
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
            issue_id
          )
        `)
        .eq("board_id", board?.id)
        .order("position");

      if (error) throw error;
      return data as BoardColumn[];
    },
    enabled: !!board?.id
  });

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
              column={column}
              onCardMove={(cardId, newPosition) => {
                console.log("Moving card", cardId, "to position", newPosition);
                // TODO: Implement card reordering
              }}
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