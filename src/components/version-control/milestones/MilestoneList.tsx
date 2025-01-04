import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Plus, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { CreateMilestoneDialog } from "./CreateMilestoneDialog";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface MilestoneUser {
  id: string;
  email: string;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  due_date: string;
  status: string;
  created_by: string;
  created_at: string;
  user: MilestoneUser;
}

interface MilestoneListProps {
  repositoryId: string;
}

export function MilestoneList({ repositoryId }: MilestoneListProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data: milestones, isLoading } = useQuery({
    queryKey: ["milestones", repositoryId],
    queryFn: async () => {
      const { data: milestonesData, error: milestonesError } = await supabase
        .from("milestones")
        .select(`
          *,
          user:profiles!milestones_created_by_fkey(
            id,
            email
          )
        `)
        .eq("repository_id", repositoryId)
        .order("created_at", { ascending: false });

      if (milestonesError) {
        console.error("Error fetching milestones:", milestonesError);
        throw milestonesError;
      }

      return milestonesData as unknown as Milestone[];
    },
  });

  if (isLoading) {
    return <div>Loading milestones...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Milestones</h2>
        <Button onClick={() => setIsCreateOpen(true)} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          New Milestone
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-4 p-1">
          {milestones?.map((milestone) => (
            <Card key={milestone.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{milestone.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {milestone.description}
                  </p>
                </div>
                <Badge variant={milestone.status === "open" ? "secondary" : "outline"}>
                  {milestone.status}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Due {formatDistanceToNow(new Date(milestone.due_date), { addSuffix: true })}</span>
                </div>
                <div>Created by {milestone.user?.email || 'Unknown user'}</div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>

      <CreateMilestoneDialog
        repositoryId={repositoryId}
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />
    </div>
  );
}