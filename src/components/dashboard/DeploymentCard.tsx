import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";
import { useSession } from "@supabase/auth-helpers-react";

export function DeploymentCard() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const session = useSession();

  return (
    <>
      <Card className="p-6 flex flex-col items-center justify-center text-center space-y-4 min-h-[200px]">
        <div className="space-y-2">
          <h3 className="font-semibold">Create New Project</h3>
          <p className="text-sm text-muted-foreground">
            Start building your next great idea
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </Card>

      {session && (
        <CreateProjectDialog 
          isOpen={isCreateOpen} 
          onOpenChange={setIsCreateOpen}
          userId={session.user.id}
        />
      )}
    </>
  );
}