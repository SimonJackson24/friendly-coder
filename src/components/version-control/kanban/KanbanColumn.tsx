import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CreateCardDialog } from "./CreateCardDialog";
import { BoardColumn } from "@/types/kanban";
import { useDrag, useDrop } from "react-dnd";

interface KanbanColumnProps {
  column: BoardColumn;
  onCardMove: (cardId: string, newPosition: number, newColumnId: string) => void;
}

export function KanbanColumn({ column, onCardMove }: KanbanColumnProps) {
  const [isCreateCardOpen, setIsCreateCardOpen] = useState(false);

  const [{ isOver }, drop] = useDrop({
    accept: "CARD",
    drop: (item: { id: string, columnId: string }) => {
      if (item.columnId !== column.id) {
        const newPosition = column.board_cards.length > 0 
          ? column.board_cards[column.board_cards.length - 1].position + 1 
          : 1;
        onCardMove(item.id, newPosition, column.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  });

  return (
    <div ref={drop} className="flex flex-col w-[300px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">{column.name}</h3>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setIsCreateCardOpen(true)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <Card className={`p-2 ${isOver ? 'bg-accent/50' : ''}`}>
        <ScrollArea className="h-[500px]">
          <div className="space-y-2">
            {column.board_cards
              .sort((a, b) => a.position - b.position)
              .map((card) => (
                <DraggableCard 
                  key={card.id}
                  id={card.id}
                  columnId={column.id}
                  content={card.content}
                />
              ))}
          </div>
        </ScrollArea>
      </Card>

      <CreateCardDialog
        columnId={column.id}
        open={isCreateCardOpen}
        onOpenChange={setIsCreateCardOpen}
      />
    </div>
  );
}

interface DraggableCardProps {
  id: string;
  columnId: string;
  content: string;
}

function DraggableCard({ id, columnId, content }: DraggableCardProps) {
  const [{ isDragging }, drag] = useDrag({
    type: "CARD",
    item: { id, columnId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  return (
    <Card 
      ref={drag}
      className={`p-3 cursor-move hover:bg-accent ${isDragging ? 'opacity-50' : ''}`}
    >
      {content}
    </Card>
  );
}