import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AndroidProjectSelectorProps {
  onProjectSelect: (projectId: string) => void;
}

export function AndroidProjectSelector({ onProjectSelect }: AndroidProjectSelectorProps) {
  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      console.log("Fetching projects for Android build selector");
      const { data, error } = await supabase
        .from("projects")
        .select("id, title")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Loading projects..." />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select onValueChange={onProjectSelect}>
      <SelectTrigger>
        <SelectValue placeholder="Select a project" />
      </SelectTrigger>
      <SelectContent>
        {projects?.map((project) => (
          <SelectItem key={project.id} value={project.id}>
            {project.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}