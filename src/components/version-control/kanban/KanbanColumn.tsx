import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CreateCardDialog } from "./CreateCardDialog";

interface KanbanColumnProps {
  column: {
    id: string;
    name: string;
    cards: Array<{
      id: string;
      content: string;
      position: number;
      issue_id?: string;
    }>;
  };
  onCardMove: (cardId: string, newPosition: number) => void;
}

export function KanbanColumn({ column, onCardMove }: KanbanColumnProps) {
  const [isCreateCardOpen, setIsCreateCardOpen] = useState(false);

  return (
    <div className="flex flex-col w-[300px]">
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

      <Card className="p-2">
        <ScrollArea className="h-[500px]">
          <div className="space-y-2">
            {column.cards
              .sort((a, b) => a.position - b.position)
              .map((card) => (
                <Card 
                  key={card.id} 
                  className="p-3 cursor-move hover:bg-accent"
                >
                  {card.content}
                </Card>
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