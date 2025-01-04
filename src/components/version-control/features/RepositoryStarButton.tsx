import { useState } from "react";
import { Star, StarOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface RepositoryStarButtonProps {
  repositoryId: string;
}

export function RepositoryStarButton({ repositoryId }: RepositoryStarButtonProps) {
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isHovered, setIsHovered] = useState(false);

  // Query to check if user has starred the repository
  const { data: userStar, isLoading: isCheckingStar } = useQuery({
    queryKey: ["repository-star", repositoryId, session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      console.log("Checking if user has starred repository:", repositoryId);
      const { data, error } = await supabase
        .from("repository_stars")
        .select("id")
        .eq("repository_id", repositoryId)
        .eq("user_id", session.user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error checking repository star:", error);
        throw error;
      }

      return data;
    },
    enabled: !!session?.user?.id,
  });

  // Query to get total star count
  const { data: starCount = 0 } = useQuery({
    queryKey: ["repository-stars-count", repositoryId],
    queryFn: async () => {
      console.log("Fetching star count for repository:", repositoryId);
      const { count, error } = await supabase
        .from("repository_stars")
        .select("*", { count: "exact", head: true })
        .eq("repository_id", repositoryId);

      if (error) {
        console.error("Error fetching repository stars count:", error);
        throw error;
      }

      return count || 0;
    },
  });

  // Mutation to toggle star
  const toggleStar = useMutation({
    mutationFn: async () => {
      if (!session?.user?.id) {
        throw new Error("Must be logged in to star repositories");
      }

      if (userStar) {
        console.log("Unstarring repository:", repositoryId);
        const { error } = await supabase
          .from("repository_stars")
          .delete()
          .eq("repository_id", repositoryId)
          .eq("user_id", session.user.id);

        if (error) throw error;
      } else {
        console.log("Starring repository:", repositoryId);
        const { error } = await supabase
          .from("repository_stars")
          .insert({
            repository_id: repositoryId,
            user_id: session.user.id,
          });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["repository-star", repositoryId] });
      queryClient.invalidateQueries({ queryKey: ["repository-stars-count", repositoryId] });
      toast({
        title: userStar ? "Repository unstarred" : "Repository starred",
        description: userStar 
          ? "You have removed your star from this repository"
          : "You have starred this repository",
      });
    },
    onError: (error: Error) => {
      console.error("Error toggling repository star:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isCheckingStar) {
    return <Button variant="ghost" size="sm" disabled>Loading...</Button>;
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-2"
      onClick={() => toggleStar.mutate()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={toggleStar.isPending || !session?.user?.id}
    >
      {userStar ? (
        isHovered ? <StarOff className="h-4 w-4" /> : <Star className="h-4 w-4 fill-current" />
      ) : (
        <Star className="h-4 w-4" />
      )}
      <span>{starCount}</span>
    </Button>
  );
}