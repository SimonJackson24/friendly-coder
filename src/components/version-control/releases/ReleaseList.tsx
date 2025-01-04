import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Tag } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { CreateReleaseDialog } from "./CreateReleaseDialog";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface ReleaseUser {
  id: string;
  email: string | null;
}

interface Release {
  id: string;
  version: string;
  name: string;
  description: string | null;
  tag_name: string;
  created_by: string;
  created_at: string;
  user: ReleaseUser;
}

interface ReleaseListProps {
  repositoryId: string;
}

export function ReleaseList({ repositoryId }: ReleaseListProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data: releases, isLoading } = useQuery({
    queryKey: ["releases", repositoryId],
    queryFn: async () => {
      console.log("Fetching releases for repository:", repositoryId);
      const { data: releasesData, error: releasesError } = await supabase
        .from("releases")
        .select(`
          *,
          user:profiles!releases_created_by_fkey(
            id,
            email
          )
        `)
        .eq("repository_id", repositoryId)
        .order("created_at", { ascending: false });

      if (releasesError) {
        console.error("Error fetching releases:", releasesError);
        throw releasesError;
      }

      return releasesData as unknown as Release[];
    },
  });

  if (isLoading) {
    return <div>Loading releases...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Releases</h2>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          New Release
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-4 p-1">
          {releases?.map((release) => (
            <Card key={release.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{release.name}</h3>
                    <Badge variant="outline">{release.version}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {release.description}
                  </p>
                </div>
                <Badge variant="secondary">
                  {release.tag_name}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Released {formatDistanceToNow(new Date(release.created_at), { addSuffix: true })}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  <span>By {release.user?.email || 'Unknown user'}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>

      <CreateReleaseDialog
        repositoryId={repositoryId}
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />
    </div>
  );
}